// Seed the Event Ease database with sample listings, reviews, users and demo bookings.
const db = require('./db');
const bcrypt = require('bcryptjs');
const { LISTINGS } = require('./data');

db.exec('DELETE FROM bookings; DELETE FROM reviews; DELETE FROM listings; DELETE FROM users;');

const hash = (p) => bcrypt.hashSync(p, 10);
const insUser = db.prepare('INSERT INTO users (name,email,phone,password_hash,role) VALUES (?,?,?,?,?)');
insUser.run('Site Admin', 'admin@eventease.pk', '041-0000000', hash('admin123'), 'admin');
const cust = insUser.run('Areeha Imran', 'areeha@example.com', '0300 1234567', hash('password123'), 'customer');
const custId = Number(cust.lastInsertRowid);

const insL = db.prepare('INSERT INTO listings (slug,name,category,city,area,address,description,price,unit,capacity,rating,reviews,phone,hue,featured) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
const ids = {};
for (const l of LISTINGS) {
  const r = insL.run(l.slug, l.name, l.category, l.city, l.area, l.address, l.description, l.price, l.unit, l.capacity, l.rating, l.reviews, l.phone, l.hue, l.featured);
  ids[l.slug] = Number(r.lastInsertRowid);
}

const insB = db.prepare('INSERT INTO bookings (ref,listing_id,user_id,event_type,event_date,guests,time_pref,name,phone,email,requirements,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
insB.run('EE-2026-0001', ids['gulshan-marquee'], custId, 'Wedding', '2026-12-14', 300, 'Evening', 'Areeha Imran', '0300 1234567', 'areeha@example.com', 'Stage decor in a pink theme please.', 'Approved');
insB.run('EE-2026-0002', ids['sky-eye-photography'], custId, 'Wedding', '2026-12-14', 300, 'Evening', 'Areeha Imran', '0300 1234567', 'areeha@example.com', 'Two-day photography coverage.', 'Pending');

console.log('Seeded:', LISTINGS.length, 'listings, 2 users, demo reviews and 2 bookings.');
console.log('Admin login:    admin@eventease.pk / admin123');
console.log('Customer login: areeha@example.com / password123');
