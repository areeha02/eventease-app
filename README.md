# Event Ease — Event Venue & Service Booking Marketplace

A full-stack web application for discovering and booking event venues and services in
**Faisalabad, Pakistan**. Customers browse categories, search and filter listings, view details,
and submit **booking requests** that are saved to a database and tracked through a dashboard.
Providers' requests are managed by an **admin** who approves or rejects them.

> **Academic project note:** All listings, prices, ratings and reviews are **clearly-labelled sample
> data** for demonstration — not verified real-business information. A booking request is **not** a
> confirmed reservation until it is approved.

---

## Features

- **8 categories:** Wedding Halls & Marquees, Corporate Venues, Seminar & Conference Halls,
  Photographers & Videographers, Event Planners & Decorators, Bridal Dresses, Groom Dresses, Catering.
- **32 sample listings** (Faisalabad-focused) with description, location, price (est.), capacity,
  rating, sample reviews, packages and contact.
- **Working search & filters:** by name, city, category, price range, guest capacity; sort by price.
- **Pages:** Home, All Services, Category pages, Listing details, Booking form, Confirmation,
  About, Contact, Login, Sign up, Customer Dashboard, Booking History, Admin Dashboard, 404.
- **Authentication:** customer sign-up / login with hashed passwords (bcrypt) and sessions.
- **Persistent booking system:** requests saved in SQLite with status
  **Pending → Approved / Rejected / Cancelled**; booking reference generated; customers can cancel.
- **Customer dashboard:** stats + booking history.
- **Admin dashboard:** view all requests and Approve / Reject; listing & user counts.
- **Responsive** coquette/pink design, consistent across all pages.

## Tech stack

| Layer     | Technology |
|-----------|------------|
| Backend   | Node.js + Express |
| Views     | EJS (server-rendered) |
| Database  | SQLite via Node's built-in `node:sqlite` (no native build needed) |
| Auth      | `express-session` + `bcryptjs` |
| Styling   | Plain CSS (Google Fonts: Poppins, Inter, Pacifico) |

## Project structure

```
eventease-app/
├─ server.js            # Express app: routes, auth, booking logic
├─ db.js                # SQLite connection + schema (tables created on start)
├─ data.js              # Categories, sample listings, content/price helpers
├─ seed.js              # Seeds listings, reviews, demo users and bookings
├─ package.json
├─ public/css/style.css # Theme & layout
└─ views/               # EJS templates
   ├─ partials/ (header, footer, card)
   ├─ home, services, listing, booking, confirm
   ├─ login, signup, dashboard, bookings, admin
   └─ about, contact, error
```

## Database schema

```
users(id, name, email UNIQUE, phone, password_hash, role['customer'|'admin'], created_at)
listings(id, slug UNIQUE, name, category, city, area, address, description,
         price, unit, capacity, rating, reviews, phone, hue, featured, status, created_at)
reviews(id, listing_id, author, rating, body, created_at)
bookings(id, ref UNIQUE, listing_id, user_id, event_type, event_date, guests, time_pref,
         name, phone, email, requirements, status['Pending'|'Approved'|'Rejected'|'Cancelled'], created_at)
```

## Run locally

Requires **Node.js 22.5+** (uses the built-in `node:sqlite` module; tested on Node 24).

```bash
cd eventease-app
npm install        # installs express, ejs, express-session, bcryptjs
npm run seed       # creates eventease.db and loads sample data + demo users
npm start          # starts http://localhost:3000
```

Open **http://localhost:3000**.

### Demo logins

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Customer | areeha@example.com     | password123  |
| Admin    | admin@eventease.pk     | admin123     |

(You can also create a new customer via **Sign up**.)

## Deploy (public live link)

This is a **full-stack Node app**, so it needs a Node host (not a static host like Netlify Drop).
Free option — **Render**:

1. Push `eventease-app/` to a GitHub repo (your own account).
2. On [render.com](https://render.com): **New → Web Service** → connect the repo.
3. Settings: **Build command** `npm install` · **Start command** `npm start` ·
   **Environment** Node · add env var `SESSION_SECRET` = any long random string.
   (On first boot the server auto-loads the sample data if the database is empty.)
4. Deploy → you get a public `https://<name>.onrender.com` URL.

> **Data persistence note:** SQLite stores data in a file (`eventease.db`). On Render's free tier the
> filesystem is **ephemeral** — data resets when the service restarts/redeploys. For permanent data,
> attach a **persistent disk** (Render paid) or switch the storage layer to **PostgreSQL** (can be
> added). For local use and demos, persistence is full.

**Railway / Cyclic / Fly.io** work similarly (Node app, start `npm start`).

## Notes / honest scope

- Listings, prices, ratings and reviews are **sample/estimated** data for demonstration.
- The booking flow is **real and persistent** (saved to the DB, with statuses), but it does not send
  emails/SMS to providers or take payments — those would be the next phase.
- Passwords are hashed with bcrypt; sessions use a signed cookie. Set a strong `SESSION_SECRET`
  in production.
