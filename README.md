# IP Address Tracker — DewanTech™

A DewanTech™ product by Dewan Global LLC. A full-stack web application for looking up any IPv4 address, IPv6 address or domain name and viewing its location, timezone and internet service provider on an interactive map.

**Live application:** https://project-react-development-ip-address.onrender.com/
**Source code:** https://github.com/DewanTechUS/Project_React_Development_IP_Address_Tracker

---

## Features

- **IP and domain search.** Accepts IPv4, IPv6 and domain names. Full URLs such as `https://example.com/page` are reduced to their host automatically.
- **Automatic lookup on load.** The visitor's own public IP is shown when the page opens. Submitting an empty search looks it up again.
- **Geolocation results.** IP address, city, region, country, UTC offset and ISP.
- **Interactive map.** A Leaflet and OpenStreetMap map that re-centers on each result, with a marker and popup.
- **Secure backend.** A Node.js and Express API keeps the IPify key on the server, validates input and rate-limits requests.
- **Optional visitor profiles.** A welcome modal invites visitors to add their name. It lists exactly what will be saved and requires an explicit "I agree". With consent, the profile and search history are stored in MongoDB. A **Forget me** link deletes everything.
- **Loading and error handling.**
  - Placeholder skeletons and a spinner while data loads.
  - Input is validated in the browser and again on the server.
  - Clear messages for invalid input, unknown hosts, rate limits and network failures.
- **Request cancellation.** Starting a new search cancels the previous one, so an older, slower response can never overwrite a newer result.
- **Persistent light and dark themes.** Light by default. The choice is saved in `localStorage` and applied before first paint, so the page never flashes the wrong theme.
- **Responsive layout.** A compact hero and a large map on mobile, tablet and desktop.
- **Accessibility.**
  - Skip-to-content link, labelled search field and visible keyboard focus styles.
  - The theme switch is exposed to screen readers as a switch.
  - Loading state is announced and errors are read aloud.
  - Reduced-motion preferences are respected.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, TypeScript (strict mode), Vite |
| State | `useState`, `useEffect`, a custom `useIpLookup` hook, Context API for theme |
| Maps | Leaflet, react-leaflet, OpenStreetMap tiles |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (official `mongodb` driver) |
| Data | IPify Geolocation API (called from the server only) |
| Styling | Plain CSS with custom properties (no UI framework) |
| Quality | ESLint for the frontend (TypeScript, React Hooks, React Refresh) and the server |

## Architecture

```
Browser (React)  ──GET /api/lookup?q=…──▶  Express server  ──▶  IPify Geolocation API
                 ◀──── JSON result ──────                  ◀──
```

In production a single Express server serves both the built React app and the `/api` endpoint. In development the same server runs Vite as middleware, so one command and one port give you hot reload and the API together.

### API

`GET /api/lookup?q=<ip-or-domain>`

| Case | Response |
| --- | --- |
| Valid IP or domain | `200` with `{ ip, isp, location: { city, region, country, timezone, lat, lng } }` |
| Empty `q` | `200` with the visitor's own public IP |
| Invalid input | `400 { error }` |
| Unknown IP or domain | `404 { error }` |
| More than 30 requests per minute from one IP | `429 { error }` |
| Upstream failure | `502 { error }` |

Requests that include an `X-Visitor-Id` header from an opted-in visitor are added to that visitor's search history.

`POST /api/visitors` creates or updates a profile. Body: `{ name, consent: true, visitorId?, device }`. It returns `201 { visitorId, name }`. It returns `400` without consent or with an invalid name, and `503` when the database is unavailable.

`DELETE /api/visitors/:visitorId` deletes the profile and all of its search history (`204`).

### Data saved for opted-in visitors

| Collection | Fields |
| --- | --- |
| `visitors` | name, IP address, approximate location and ISP, user agent, browser, OS, device type, accepted languages, and device details (timezone, language, screen and viewport size, pixel ratio, touch support, color scheme); `createdAt`, `consentAt`, `lastSeenAt` |
| `ip_search_history` | query, result summary (IP, city, region, country, ISP), `createdAt` |

Both collections live in the `dewantech_ip_tracker` database. TTL indexes delete inactive profiles and old searches after 12 months. Nothing is saved for visitors who skip the modal.

## Project Structure

```
server/
├── index.js                 Express app: routes, security headers, static files / Vite dev middleware
├── db.js                    MongoDB connection and indexes (unique IDs, 12-month TTL)
├── ipify.js                 IPify client: validation, visitor IP detection, error mapping
├── visitors.js              Consent-based visitor profiles, search history, "Forget me"
├── userAgent.js             Browser / OS / device type from the User-Agent header
└── rateLimit.js             In-memory, per-IP rate limiter
src/
├── App.tsx                  Page layout; wires the search to the data hook
├── main.tsx                 Entry point; ThemeProvider and global styles
├── index.css                Design tokens, themes and responsive styles
├── assets/                  DewanTech™ logo and app icon (bundled by Vite)
├── components/
│   ├── Header.tsx           App header: icon, name, source link, theme switch
│   ├── Footer.tsx           DewanTech™ footer: logo, links, copyright
│   ├── Logo.tsx             DewanTech™ logo mark and wordmark
│   ├── SearchBar.tsx        Accessible search form
│   ├── InfoCards.tsx        IP, location, timezone and ISP results
│   ├── MapView.tsx          Leaflet map with auto re-centering
│   ├── ThemeToggle.tsx      Light/dark switch
│   └── WelcomeModal.tsx     Consent-based name prompt (native <dialog>)
├── context/
│   ├── theme.ts             Theme context and useTheme hook
│   └── ThemeContext.tsx     ThemeProvider with persistence
├── hooks/
│   └── useIpLookup.ts       Fetch state, error handling, request cancellation
├── lib/
│   ├── api.ts               Client for the backend /api/lookup endpoint
│   ├── brand.ts             Copyright and external links
│   ├── format.ts            Location formatting
│   ├── types.ts             Lookup result types
│   └── visitor.ts           Visitor ID storage, device details, save / forget
└── utils/
    └── validators.ts        IPv4, IPv6 and domain validation, input normalizing
```

## Getting Started

**Requirements:** Node.js 20.12 or newer, and a free API key from [geo.ipify.org](https://geo.ipify.org/).

```bash
git clone https://github.com/DewanTechUS/Project_React_Development_IP_Address_Tracker.git
cd Project_React_Development_IP_Address_Tracker
npm install
cp .env.example .env    # then add your IPify key (and MongoDB URI to enable profiles)
npm run dev
```

Open http://localhost:3000, or the `PORT` set in `.env`.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Express server with Vite hot reload; restarts on server changes |
| `npm run build` | Type-check and build the React app into `dist/` |
| `npm start` | Serve the production build and the API |
| `npm run lint` | Run ESLint on the frontend and server |

## Security

- **API key stays on the server.** It is read from `IPIFY_API_KEY`, never sent to the browser and not included in the frontend bundle.
- **Database credentials stay on the server.** `MONGODB_URI` is read on the server only. Without it, the app still works and profile saving is disabled.
- **Secrets are never committed.** `.env` and `.env.*` are listed in `.gitignore`; only the placeholder `.env.example` is tracked.
- **Input validation.** Queries are validated and length-limited in the browser and on the server, then URL-encoded before reaching IPify.
- **Rate limiting.** Each IP is limited to 30 lookups per minute to protect API credits. The limiter is in memory, so it is best-effort and per instance.
- **Minimal responses.** The server returns only the fields the UI uses.
- **Consent first.** Visitor data is saved only after an explicit opt-in that lists every field. Device details from the browser are limited to an allow-list and bounded in size. No fingerprinting techniques are used.
- **Data retention.** Data expires after 12 months, and visitors can delete it at any time.
- **Security headers.** `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` are set, and `X-Powered-By` is disabled.
- **Safe external links.** They open with `rel="noopener noreferrer"`.

## Deployment (Render)

Deploy as a **Web Service**; a static site cannot run the backend.

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Build command | `npm install && npm run build` |
| Start command | `npm start` |
| Environment variables | `IPIFY_API_KEY`; optional `MONGODB_URI` |

Render provides `PORT` automatically. In MongoDB Atlas, open **Network Access** and allow connections from Render. The free tier has no fixed outbound IPs, so this usually means `0.0.0.0/0`; your database password still protects access.

## Engineering Highlights

- **Backend proxy.** The browser talks only to `/api/lookup`. The server owns the API key, validation, visitor IP detection behind Render's proxy, upstream timeouts and error mapping.
- **One server, one port.** In development, Vite runs as Express middleware, with hot reload sharing the server's port. In production, the same server serves hashed assets with long-lived caching.
- **Clean data flow.** `lib/api.ts` performs the request. `hooks/useIpLookup.ts` owns loading and error state and cancels stale requests with `AbortController`.
- **Map synchronization.** The Leaflet map is re-centered in an effect whenever new coordinates arrive, and it uses an explicit marker icon so assets resolve correctly in every build mode.
- **Theme without flash.** A small inline script applies the saved theme before React loads. The Context provider then keeps it in sync.
- **Lean dependencies.** Express is the only runtime addition. IP validation uses Node's `net` module on the server and the browser's URL parser on the client, and `.env` loading uses Node's built-in `process.loadEnvFile`.

## Author

**Dewan Mahmud (Rocky)**, founder of Dewan Global LLC dba DewanTech™
Full-Stack Software Engineer and IT Support Specialist, Norcross, Georgia

- Company: https://www.dewantech.com
- Portfolio: https://www.dewanmahmud.com
- GitHub: https://github.com/DewanTechUS

---

© 2026 Dewan Global LLC dba DewanTech™. All rights reserved.
