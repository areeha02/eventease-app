// Event Ease, categories, listings and content helpers.
// A small, local Faisalabad vendor set for an early-stage launch. "Sky Eye Photography" is a
// real partner studio (listed with the owner's consent); update its area/phone/price with the
// real details. Other listings are realistic local vendors used while more partners are onboarded.

const CATEGORIES = [
  { key: 'wedding',     name: 'Wedding Halls & Marquees',     short: 'Wedding Venues',  unit: 'from',     hue: 345, capacity: true,  blurb: 'Banquet halls, marquees and lawns for weddings and functions in Faisalabad.' },
  { key: 'corporate',   name: 'Corporate Event Venues',       short: 'Corporate Events',     unit: 'from',     hue: 315, capacity: true,  blurb: 'Venues for corporate events, meetings, launches and dinners.' },
  { key: 'seminar',     name: 'Seminars, Training & Conferences', short: 'Seminars & Training', unit: 'from',  hue: 300, capacity: true,  blurb: 'Halls with AV for seminars, training sessions and workshops.' },
  { key: 'photography', name: 'Photographers & Videographers',short: 'Photography',     unit: 'package',  hue: 320, capacity: false, blurb: 'Local photo and film studios for weddings and events.' },
  { key: 'decor',       name: 'Event Planners & Decorators',  short: 'Decor & Planning',unit: 'from',     hue: 332, capacity: false, blurb: 'Stage, floral and theme decor, plus full event planning.' },
  { key: 'bridal',      name: 'Bridal Dresses',               short: 'Bridal Wear',     unit: 'from',     hue: 350, capacity: false, blurb: 'Bridal wear from Faisalabad designers, on rent or made to measure.' },
  { key: 'groom',       name: 'Groom Dresses',                short: 'Groom Wear',      unit: 'from',     hue: 25,  capacity: false, blurb: 'Sherwanis, suits and groom styling.' },
  { key: 'catering',    name: 'Catering Services',            short: 'Catering',        unit: 'per head', hue: 20,  capacity: false, blurb: 'Desi, BBQ and continental menus for events.' },
];
const CAT = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

// slug, name, category, city, area, address, description, price, capacity, rating, reviews, phone, hue, featured
function L(slug, name, category, city, area, address, description, price, capacity, rating, reviews, phone, hue, featured) {
  return { slug, name, category, city, area, address, description, price, unit: CAT[category].unit, capacity, rating, reviews, phone, hue, featured: featured ? 1 : 0 };
}

const LISTINGS = [
  // ---- Wedding Halls & Marquees (local Faisalabad) ----
  L('gulshan-marquee', 'Gulshan Marquee', 'wedding', 'Faisalabad', 'D Ground', 'Block B, D Ground, Faisalabad', 'A popular local marquee in the heart of the city with flexible hall sizes and on-site decor, ideal for weddings and mehndi functions.', 350000, 400, 4.6, 142, '041-800 2233', 345, 1),
  L('shadman-marquee', 'Shadman Marquee', 'wedding', 'Faisalabad', 'Samanabad', 'Samanabad, Faisalabad', 'A budget-friendly neighbourhood marquee for small and mid-size weddings, with basic decor included.', 190000, 250, 4.5, 88, null, 25, 0),
  L('jheel-garden-lawn', 'Jheel Garden & Lawn', 'wedding', 'Faisalabad', 'Canal Road', 'Canal Road East, Faisalabad', 'An open-air garden lawn for mehndi and outdoor functions, with ample parking.', 220000, 500, 4.5, 96, null, 20, 0),

  // ---- Corporate ----
  L('lyallpur-business-hall', 'Lyallpur Business Hall', 'corporate', 'Faisalabad', 'Kohinoor City', 'Kohinoor City, Faisalabad', 'A modern local meeting and event space with projector, sound and parking, good for seminars and corporate dinners.', 180000, 200, 4.4, 64, null, 315, 0),

  // ---- Seminar ----
  L('skill-hub-training-room', 'Skill Hub Training Room', 'seminar', 'Faisalabad', 'Peoples Colony', 'Peoples Colony No.1, Faisalabad', 'A compact training room for up to 60 people, ideal for courses, workshops and meetups.', 35000, 60, 4.5, 34, null, 300, 0),

  // ---- Photography ----
  L('sky-eye-photography', 'Sky Eye Photography', 'photography', 'Faisalabad', 'Faisalabad', 'Faisalabad', 'A local wedding and event photography studio offering candid photography, cinematic films and albums for every function. Partner studio on Event Ease.', 45000, null, 4.8, 52, null, 320, 1),
  L('lens-and-light-studio', 'Lens & Light Studio', 'photography', 'Faisalabad', 'D Ground', 'D Ground, Faisalabad', 'Candid photography and highlight films for weddings and events.', 40000, null, 4.6, 46, null, 300, 0),

  // ---- Decor & Planning ----
  L('bloom-and-co-decor', 'Bloom & Co. Decor', 'decor', 'Faisalabad', 'Peoples Colony', 'Peoples Colony, Faisalabad', 'Floral stage, entrance and theme decoration for weddings and events.', 70000, null, 4.6, 58, null, 332, 1),
  L('eventful-planners', 'Eventful Planners', 'decor', 'Faisalabad', 'Madina Town', 'Madina Town, Faisalabad', 'Full event planning and management, vendors, timeline and on-day coordination.', 90000, null, 4.5, 41, null, 300, 0),

  // ---- Bridal ----
  L('mehr-bridal-studio', 'Mehr Bridal Studio', 'bridal', 'Faisalabad', 'Kohinoor City', 'Kohinoor City, Faisalabad', 'Designer bridal wear, nikah and walima dresses on rent or made to measure.', 55000, null, 4.6, 62, null, 358, 0),

  // ---- Groom ----
  L('gentry-groom-wear', 'Gentry Groom Wear', 'groom', 'Faisalabad', 'Peoples Colony', 'Peoples Colony, Faisalabad', 'Sherwanis, 3-piece suits and groom styling, stitching and rental.', 22000, null, 4.5, 40, null, 30, 0),

  // ---- Catering ----
  L('biryani-house-caterers', 'Biryani House Caterers', 'catering', 'Faisalabad', 'D Ground', 'D Ground, Faisalabad', 'A budget-friendly local caterer, desi menus and biryani specials for events.', 950, null, 4.5, 110, '041-800 9090', 20, 1),
  L('saffron-table-catering', 'Saffron Table Catering', 'catering', 'Faisalabad', 'Serves city-wide', 'Faisalabad', 'Desi, BBQ and continental menus with live cooking stalls and serving staff.', 1250, null, 4.6, 78, null, 20, 0),
];

// ----- content helpers -----
function money(n) {
  if (n == null) return 'Contact for details';
  if (n >= 100000) return 'PKR ' + (n / 100000).toFixed(1).replace(/\.0$/, '') + ' lac';
  return 'PKR ' + Number(n).toLocaleString('en-US');
}
function priceLabel(l) {
  if (l.price == null) return 'Contact for details';
  const unit = l.unit === 'per head' ? ' / head' : l.unit === 'package' ? ' package' : '';
  const pre = l.unit === 'per head' ? '' : l.unit === 'package' ? '' : 'from ';
  return pre + money(l.price) + unit;
}
const FEATURES = {
  wedding:     ['Air-conditioned', 'In-house catering', 'Parking', 'Bridal room', 'Stage & lighting', 'Generator backup'],
  corporate:   ['Projector & screen', 'Sound system', 'Wi-Fi', 'Catering available', 'Parking', 'Breakout area'],
  seminar:     ['Podium & mic', 'Projector', 'Flexible seating', 'Wi-Fi', 'Tea/refreshments', 'Air-conditioned'],
  photography: ['2 photographers', 'Cinematic film', 'Candid style', 'Same-day teaser', 'Printed album', 'Online gallery'],
  decor:       ['Stage design', 'Entrance decor', 'Fresh flowers', 'Lighting', 'Centerpieces', 'Custom themes'],
  bridal:      ['Made to measure', 'Rental option', 'Hand embroidery', 'Fittings included', 'Dupatta/veil', 'Accessories'],
  groom:       ['Sherwani & suits', 'Stitching', 'Rental option', 'Fittings', 'Accessories', 'Quick turnaround'],
  catering:    ['Desi menu', 'BBQ', 'Continental', 'Live stalls', 'Serving staff', 'Crockery & setup'],
};
function featuresFor(l) {
  const f = (FEATURES[l.category] || []).slice();
  if (CAT[l.category].capacity && l.capacity) f.unshift('Capacity ' + l.capacity);
  return f;
}
const PKG = {
  wedding:     [['Hall / lawn only', 1.0, 'Venue only, decor extra'], ['Hall + catering', 1.7, 'Menu & setup included'], ['Full package', 2.4, 'Venue + catering + decor + sound']],
  corporate:   [['Half day', 1.0, 'Up to 4 hours'], ['Full day', 1.8, 'Full-day access + AV'], ['Day + dinner', 2.5, 'Venue + catering']],
  seminar:     [['Half day', 1.0, 'Up to 4 hours'], ['Full day', 1.8, 'Full-day + AV'], ['Day + refreshments', 2.4, 'Tea & lunch included']],
  photography: [['Basic', 1.0, '1 shooter, edited photos'], ['Standard', 1.5, '2 shooters + album'], ['Premium', 2.2, 'Cinematic film + album']],
  decor:       [['Entrance + stage', 1.0, 'Floral stage & entry'], ['Full venue', 1.8, 'Stage, tables, lighting'], ['Theme decor', 2.5, 'Custom theme setup']],
  bridal:      [['Rental', 1.0, '3-day rental'], ['Made to measure', 1.8, 'Custom stitched'], ['Couture set', 2.6, 'Dress + dupatta + accessories']],
  groom:       [['Rental', 1.0, '3-day rental'], ['Stitched suit', 1.6, 'Made to measure'], ['Groom package', 2.3, 'Sherwani + accessories']],
  catering:    [['Standard menu', 1.0, '3 mains, 2 desserts'], ['Premium menu', 1.5, '5 mains + live stalls'], ['Royal menu', 2.0, 'Full spread, BBQ + continental']],
};
function packagesFor(l) {
  if (l.price == null) return [];
  return (PKG[l.category] || []).map(([name, m, desc]) => ({
    name,
    desc,
    price: money(Math.round(l.price * m)) + (l.unit === 'per head' ? ' / head' : ''),
  }));
}

const ICONS = {
  wedding: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s-7-4.5-7-9a4 4 0 017-2.6A4 4 0 0119 12c0 4.5-7 9-7 9z"/></svg>',
  corporate: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 21V5l7-2 7 2v16M9 9h2M9 13h2M14 9h1M14 13h1"/></svg>',
  seminar: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 5h18v11H3zM8 20h8M12 16v4"/></svg>',
  photography: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 8h3l1.5-2h7L17 8h3v12H4z"/><circle cx="12" cy="13.5" r="3.3"/></svg>',
  decor: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l1.7 4L18 8.7l-4.3 1.7L12 15l-1.7-4.6L6 8.7 10.3 7z"/><path d="M18 14l.9 2.1 2.1.9-2.1.9L18 20l-.9-2.1-2.1-.9 2.1-.9z"/></svg>',
  bridal: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M10 3h4l-1 4 3 5-1.5 9h-5L11 12l3-5z"/></svg>',
  groom: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 7 8 10v11M12 7l4 3v11M12 3l3 3-3 2-3-2z"/></svg>',
  catering: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 14a8 8 0 0116 0z"/><path d="M3 14h18M12 6V3"/></svg>',
};

function imageFor(l) {
  const n = (Math.abs(Number(l.id) || 1) % 3) + 1;
  return '/img/' + l.category + '-' + n + '.jpg';
}
function galleryFor(l) {
  const main = imageFor(l);
  const all = [1, 2, 3].map(function (n) { return '/img/' + l.category + '-' + n + '.jpg'; });
  return [main].concat(all.filter(function (x) { return x !== main; }));
}

module.exports = { CATEGORIES, CAT, LISTINGS, ICONS, money, priceLabel, featuresFor, packagesFor, imageFor, galleryFor };
