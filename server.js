// Event Ease | Express server (full-stack: pages, auth, persistent bookings)
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('./db');
const { CATEGORIES, CAT, ICONS, money, priceLabel, featuresFor, packagesFor, imageFor, galleryFor } = require('./data');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'eventease-dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
}));

// shared template locals
app.use((req, res, next) => {
  res.locals.categories = CATEGORIES;
  res.locals.CAT = CAT;
  res.locals.ICONS = ICONS;
  res.locals.imageFor = imageFor;
  res.locals.galleryFor = galleryFor;
  res.locals.user = req.session.user || null;
  res.locals.priceLabel = priceLabel;
  res.locals.money = money;
  res.locals.curPath = req.path;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  res.locals.query = req.query || {};
  next();
});

function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.flash = { type: 'warn', msg: 'Please sign in to continue.' };
    return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
  }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).render('error', { title: 'Forbidden', message: 'Admin access only.' });
  }
  next();
}

// ---- listing query with filters ----
function queryListings(f) {
  let sql = 'SELECT * FROM listings WHERE 1=1';
  const p = [];
  if (f.cat && CAT[f.cat]) { sql += ' AND category=?'; p.push(f.cat); }
  if (f.city && f.city !== 'All' && f.city !== '') { sql += ' AND city=?'; p.push(f.city); }
  if (f.q) { const q = '%' + String(f.q).toLowerCase() + '%'; sql += ' AND (LOWER(name) LIKE ? OR LOWER(area) LIKE ? OR LOWER(city) LIKE ? OR LOWER(description) LIKE ?)'; p.push(q, q, q, q); }
  if (f.min) { sql += ' AND price IS NOT NULL AND price>=?'; p.push(Number(f.min)); }
  if (f.max) { sql += ' AND price IS NOT NULL AND price<=?'; p.push(Number(f.max)); }
  if (f.cap) { sql += ' AND capacity IS NOT NULL AND capacity>=?'; p.push(Number(f.cap)); }
  if (f.sort === 'price_asc') sql += ' ORDER BY (price IS NULL), price ASC';
  else if (f.sort === 'price_desc') sql += ' ORDER BY price DESC';
  else sql += ' ORDER BY featured DESC, rating DESC, reviews DESC';
  return db.prepare(sql).all(...p);
}
const cities = () => db.prepare('SELECT DISTINCT city FROM listings ORDER BY city').all().map(r => r.city);

// ---- pages ----
app.get('/', (req, res) => {
  const featured = db.prepare('SELECT * FROM listings WHERE featured=1 ORDER BY rating DESC').all();
  const counts = db.prepare('SELECT category, COUNT(*) c FROM listings GROUP BY category').all();
  const countMap = Object.fromEntries(counts.map(r => [r.category, r.c]));
  res.render('home', { title: 'Event Ease | Book Venues & Services in Faisalabad', featured, countMap, cities: cities() });
});

app.get('/services', (req, res) => {
  const listings = queryListings(req.query);
  res.render('services', { title: 'All Services | Event Ease', listings, cities: cities(), f: req.query, heading: 'All venues & services', cat: null });
});

app.get('/category/:cat', (req, res) => {
  const c = CAT[req.params.cat];
  if (!c) return res.status(404).render('error', { title: 'Not found', message: 'Category not found.' });
  const f = Object.assign({}, req.query, { cat: c.key });
  const listings = queryListings(f);
  res.render('services', { title: c.name + ' | Event Ease', listings, cities: cities(), f, heading: c.name, cat: c });
});

app.get('/listing/:slug', (req, res) => {
  const l = db.prepare('SELECT * FROM listings WHERE slug=?').get(req.params.slug);
  if (!l) return res.status(404).render('error', { title: 'Not found', message: 'Listing not found.' });
  const reviews = db.prepare('SELECT * FROM reviews WHERE listing_id=? ORDER BY id DESC').all(l.id);
  res.render('listing', { title: l.name + ' | Event Ease', l, cat: CAT[l.category], features: featuresFor(l), packages: packagesFor(l), reviews });
});

app.get('/about', (req, res) => res.render('about', { title: 'About | Event Ease' }));
app.get('/contact', (req, res) => res.render('contact', { title: 'Contact | Event Ease' }));
app.post('/contact', (req, res) => {
  req.session.flash = { type: 'ok', msg: 'Thanks! Your message has been received.' };
  res.redirect('/contact');
});

app.get('/plans', (req, res) => res.render('plans', { title: 'Plans & Membership | Event Ease' }));

app.get('/welcome', requireAuth, (req, res) => res.render('welcome', { title: 'Welcome | Event Ease' }));

app.post('/feedback', (req, res) => {
  const rating = req.body.rating ? Number(req.body.rating) : null;
  db.prepare('INSERT INTO feedback (rating, message, user_id) VALUES (?,?,?)')
    .run(rating, req.body.message || null, req.session.user ? req.session.user.id : null);
  req.session.flash = { type: 'ok', msg: 'Thanks for your feedback!' };
  res.redirect(req.get('referer') || '/');
});

// ---- booking ----
app.get('/booking/:slug', requireAuth, (req, res) => {
  const l = db.prepare('SELECT * FROM listings WHERE slug=?').get(req.params.slug);
  if (!l) return res.status(404).render('error', { title: 'Not found', message: 'Listing not found.' });
  res.render('booking', { title: 'Book ' + l.name + ' | Event Ease', l, cat: CAT[l.category] });
});

app.post('/booking', requireAuth, (req, res) => {
  const { slug, event_type, event_date, guests, time_pref, name, phone, email, requirements } = req.body;
  const l = db.prepare('SELECT * FROM listings WHERE slug=?').get(slug);
  if (!l) return res.status(404).render('error', { title: 'Not found', message: 'Listing not found.' });
  const errors = [];
  if (!event_date) errors.push('Please choose an event date.');
  if (!name) errors.push('Please enter your name.');
  if (!phone) errors.push('Please enter a phone number.');
  if (errors.length) {
    return res.render('booking', { title: 'Book ' + l.name, l, cat: CAT[l.category], errors, form: req.body });
  }
  const ref = 'EE-' + new Date().getFullYear() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
  db.prepare('INSERT INTO bookings (ref,listing_id,user_id,event_type,event_date,guests,time_pref,name,phone,email,requirements,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(ref, l.id, req.session.user.id, event_type || null, event_date, guests ? Number(guests) : null, time_pref || null, name, phone, email || null, requirements || null, 'Pending');
  res.redirect('/booking/confirm/' + ref);
});

app.get('/booking/confirm/:ref', requireAuth, (req, res) => {
  const bk = db.prepare('SELECT b.*, l.name AS listing_name, l.slug AS listing_slug, l.city AS city FROM bookings b JOIN listings l ON l.id=b.listing_id WHERE b.ref=? AND b.user_id=?')
    .get(req.params.ref, req.session.user.id);
  if (!bk) return res.status(404).render('error', { title: 'Not found', message: 'Booking not found.' });
  res.render('confirm', { title: 'Request submitted | Event Ease', bk });
});

app.post('/booking/:id/cancel', requireAuth, (req, res) => {
  const bk = db.prepare('SELECT * FROM bookings WHERE id=? AND user_id=?').get(req.params.id, req.session.user.id);
  if (bk && (bk.status === 'Pending' || bk.status === 'Approved')) {
    db.prepare("UPDATE bookings SET status='Cancelled' WHERE id=?").run(bk.id);
    req.session.flash = { type: 'ok', msg: 'Booking ' + bk.ref + ' cancelled.' };
  }
  res.redirect('/dashboard/bookings');
});

// ---- dashboards ----
app.get('/dashboard', requireAuth, (req, res) => {
  const uid = req.session.user.id;
  const stat = (s) => db.prepare('SELECT COUNT(*) c FROM bookings WHERE user_id=? AND status=?').get(uid, s).c;
  const recent = db.prepare('SELECT b.*, l.name AS listing_name, l.slug AS listing_slug FROM bookings b JOIN listings l ON l.id=b.listing_id WHERE b.user_id=? ORDER BY b.id DESC LIMIT 5').all(uid);
  res.render('dashboard', { title: 'Dashboard | Event Ease', stats: { pending: stat('Pending'), approved: stat('Approved'), total: db.prepare('SELECT COUNT(*) c FROM bookings WHERE user_id=?').get(uid).c }, recent });
});

app.get('/dashboard/bookings', requireAuth, (req, res) => {
  const list = db.prepare('SELECT b.*, l.name AS listing_name, l.slug AS listing_slug, l.city AS city FROM bookings b JOIN listings l ON l.id=b.listing_id WHERE b.user_id=? ORDER BY b.id DESC').all(req.session.user.id);
  res.render('bookings', { title: 'My Bookings | Event Ease', list });
});

app.get('/admin', requireAdmin, (req, res) => {
  const bookings = db.prepare('SELECT b.*, l.name AS listing_name, u.name AS user_name FROM bookings b JOIN listings l ON l.id=b.listing_id JOIN users u ON u.id=b.user_id ORDER BY b.id DESC').all();
  const counts = {
    listings: db.prepare('SELECT COUNT(*) c FROM listings').get().c,
    users: db.prepare("SELECT COUNT(*) c FROM users WHERE role='customer'").get().c,
    pending: db.prepare("SELECT COUNT(*) c FROM bookings WHERE status='Pending'").get().c,
  };
  res.render('admin', { title: 'Admin | Event Ease', bookings, counts });
});

app.post('/admin/booking/:id/status', requireAdmin, (req, res) => {
  const status = req.body.status;
  if (['Approved', 'Rejected', 'Pending'].includes(status)) {
    db.prepare('UPDATE bookings SET status=? WHERE id=?').run(status, req.params.id);
  }
  res.redirect('/admin');
});

// ---- auth ----
app.get('/login', (req, res) => res.render('login', { title: 'Sign in | Event Ease', next: req.query.next || '' }));
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const u = db.prepare('SELECT * FROM users WHERE email=?').get((email || '').trim().toLowerCase());
  if (!u || !bcrypt.compareSync(password || '', u.password_hash)) {
    return res.render('login', { title: 'Sign in', error: 'Invalid email or password.', next: req.body.next || '' });
  }
  req.session.user = { id: u.id, name: u.name, email: u.email, role: u.role };
  res.redirect(req.body.next || (u.role === 'admin' ? '/admin' : '/dashboard'));
});

app.get('/signup', (req, res) => res.render('signup', { title: 'Create account | Event Ease' }));
app.post('/signup', (req, res) => {
  const { name, email, phone, password } = req.body;
  const mail = (email || '').trim().toLowerCase();
  const errors = [];
  if (!name) errors.push('Please enter your name.');
  if (!mail) errors.push('Please enter an email.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
  if (mail && db.prepare('SELECT id FROM users WHERE email=?').get(mail)) errors.push('An account with this email already exists.');
  if (errors.length) return res.render('signup', { title: 'Create account', errors, form: req.body });
  const r = db.prepare('INSERT INTO users (name,email,phone,password_hash,role) VALUES (?,?,?,?,?)')
    .run(name, mail, phone || null, bcrypt.hashSync(password, 10), 'customer');
  req.session.user = { id: Number(r.lastInsertRowid), name, email: mail, role: 'customer' };
  res.redirect('/welcome');
});

app.post('/logout', (req, res) => { req.session.destroy(() => res.redirect('/')); });

// ---- 404 ----
app.use((req, res) => res.status(404).render('error', { title: 'Not found', message: 'Page not found.' }));

// Deploy-safe: if the database has no listings (e.g. a fresh cloud instance), load sample data.
try {
  if (db.prepare('SELECT COUNT(*) c FROM listings').get().c === 0) {
    console.log('Empty database detected | loading sample data...');
    require('./seed');
  }
} catch (e) {
  console.error('Seed check failed:', e.message);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Event Ease running at http://localhost:' + PORT));
