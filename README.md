# Fawares Al Shamal Environmental Services

Website for **Fawares Al Shamal Environmental Services Co.** — scrap collection, transportation, and recycling across Dammam and the Eastern Province.

Built as a **MERN** app: React frontend, Express API, and MongoDB for quote requests (with a local JSON fallback when MongoDB is not configured).

## Pages and sections

1. Hero with company introduction and quote form  
2. About / Our Commitment  
3. Materials we handle (six categories)  
4. How we work (enquiry → payment)  
5. Service areas: pickups across Dammam & Eastern Province  
6. Final CTA, quote modal, and contact strip  

English and Arabic are available from the header language toggle.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://127.0.0.1:43145](http://127.0.0.1:43145).

Production build:

```bash
npm run build
npm start
```

## Environment

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port (default `43145`) |
| `MONGO_URI` | MongoDB connection string. If empty, quotes are stored in `server/data/quotes.json` |
| `ADMIN_PASSWORD` | Password for `/admin` quote inbox |
| `VITE_PHONE` | Display phone number |
| `VITE_EMAIL` | Display email |
| `VITE_WHATSAPP` | WhatsApp number without `+` |

Phone, email, and WhatsApp in the repo are placeholders. Replace them in `.env` with the live company contacts.

Quote submissions are saved through `POST /api/quotes`. Review them at `/admin`.

Section photographs are Wikimedia Commons stills used as industry reference imagery. Replace them with the company’s own photos before a public launch.
