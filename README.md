# Hospital Queue (HealFlow) — Minimal MVP

## What this project contains

- Node + Express server with Passport OAuth (Google) & local auth (bcrypt)
- PostgreSQL schema for users, departments, bookings
- EJS templates + Bootstrap + custom CSS for modern look
- API endpoint to query estimated wait times
- Simple predictor in code (replace with ML or historical avg later)

## How to run

1. Install dependencies: `npm install`
2. Copy `.env.example` -> `.env` and fill credentials
3. Create Postgres DB and run `sql/schema.sql`
4. Start server: `npm run dev` or `npm start`

## Next steps to turn MVP into production

- Replace naive wait estimator with historical averaging or simple ML (exponential moving average on service times)
- Add real-time updates (WebSockets) for live queue position
- Integrate a mapping SDK for true micro-maps (Leaflet or Google Maps), indoor wayfinding
- Push notifications / SMS reminders using Twilio
- Admin dashboard for staff to mark when serving a token
- Rate-limit, input sanitization, more thorough validation & tests
