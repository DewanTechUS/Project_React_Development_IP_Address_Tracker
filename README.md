# IP Address Tracker — DewanTech™

A DewanTech™ product by Dewan Global LLC. A responsive web application for looking up any IPv4 address, IPv6 address or domain name and viewing its location, timezone and internet service provider on an interactive map.

**Live application:** https://project-react-development-ip-address.onrender.com/
**Source code:** https://github.com/DewanTechUS/Project_React_Development_IP_Address_Tracker

---

## Features

- **IP and domain search.** Accepts IPv4, IPv6 and domain names. Full URLs such as `https://example.com/page` are reduced to their host automatically.
- **Automatic lookup on load.** The visitor's own public IP is shown when the page opens. Submitting an empty search looks it up again.
- **Geolocation results.** IP address, city, region, country, UTC offset and ISP.
- **Interactive map.** A Leaflet and OpenStreetMap map that re-centers on each result, with a marker and popup.
- **IP details panel.**
  - Network: IP version, ASN, network name, IP range (CIDR), network type and the network owner's website.
  - Location: full country name, live local time at the IP's location, coordinates and an "Open in Google Maps" link. The postal code is shown when available.
- **Copy and share.** Copy the IP address or coordinates with one click. Every result has a shareable link (`?q=8.8.8.8`) that opens straight to it.
- **Recent searches.** The last five successful searches appear as quick buttons next to **My IP**. They are stored only in the visitor's browser and can be cleared.
- **Loading and error handling.**
  - Placeholder skeletons and a spinner while data loads.
  - Input is validated before any request is sent.
  - Clear messages for invalid input, unknown hosts, API key problems, rate limits and network failures.
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
| UI | React 19 (function components and hooks) |
| Language | TypeScript (strict mode) |
| Build tooling | Vite |
| State | `useState`, `useEffect`, a custom `useIpLookup` hook, Context API for theme |
| Maps | Leaflet, react-leaflet, OpenStreetMap tiles |
| Data | IPify Geolocation API |
| Styling | Plain CSS with custom properties (no UI framework) |
| Quality | ESLint with TypeScript, React Hooks and React Refresh rules |

## Project Structure

```
src/
├── App.tsx                  Page layout; wires the search to the data hook
├── main.tsx                 Entry point; ThemeProvider and global styles
├── index.css                Design tokens, themes and responsive styles
├── assets/                  DewanTech™ logo tile and app icon (bundled by Vite)
├── components/
│   ├── Header.tsx           App header: icon, name, source link, theme switch
│   ├── Footer.tsx           DewanTech™ footer: logo, links, copyright
│   ├── Logo.tsx             DewanTech™ lockup: logo tile, wordmark and tagline
│   ├── SearchBar.tsx        Accessible search form
│   ├── InfoCards.tsx        IP, location, timezone and ISP results
│   ├── IpDetails.tsx        Network and location details, share link
│   ├── RecentSearches.tsx   My IP and recent-search quick buttons
│   ├── CopyButton.tsx       Clipboard copy with "Copied" feedback
│   ├── MapView.tsx          Leaflet map with auto re-centering
│   └── ThemeToggle.tsx      Light/dark switch
├── context/
│   ├── theme.ts             Theme context and useTheme hook
│   └── ThemeContext.tsx     ThemeProvider with persistence
├── hooks/
│   └── useIpLookup.ts       Fetch state, error handling, request cancellation
├── lib/
│   ├── api.ts               IPify API client and error mapping
│   ├── brand.ts             Copyright and external links
│   ├── format.ts            Location, country, local time and URL helpers
│   ├── recent.ts            Recent searches in localStorage
│   └── types.ts             Lookup result and network (ASN) types
└── utils/
    └── validators.ts        IPv4, IPv6 and domain validation, input normalizing
```

## Getting Started

**Requirements:** Node.js 20.19 or newer, and a free API key from [geo.ipify.org](https://geo.ipify.org/).

```bash
git clone https://github.com/DewanTechUS/Project_React_Development_IP_Address_Tracker.git
cd Project_React_Development_IP_Address_Tracker
npm install
cp .env.example .env    # then add your IPify key
npm run dev
```

Open http://localhost:5173.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Security Notes

- `.env` and `.env.*` are listed in `.gitignore`, so the API key is never committed. Only the placeholder `.env.example` is tracked.
- Vite embeds every `VITE_`-prefixed variable in the browser bundle at build time, so the IPify key is visible to anyone who inspects the deployed site. That is unavoidable for a frontend-only app. Monitor usage and credits in the IPify dashboard, and regenerate the key if it is abused.
- All user input is validated and URL-encoded before it is sent to the API.
- External links open with `rel="noopener noreferrer"`.

## Deployment

The live application is hosted on Render as a static site.

| Setting | Value |
| --- | --- |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |
| Environment variable | `VITE_IPIFY_API_KEY` (must be set before the build runs) |

## Engineering Highlights

- **Single data layer.** `lib/api.ts` handles validation, request building and HTTP status mapping. `hooks/useIpLookup.ts` owns loading and error state and cancels stale requests with `AbortController`.
- **Map synchronization.** The Leaflet map is re-centered in an effect whenever new coordinates arrive, and it uses an explicit marker icon so assets resolve correctly in every build mode.
- **Theme without flash.** A small inline script applies the saved theme before React loads. The Context provider then keeps it in sync and persists changes.
- **More data, same request.** The details panel uses fields IPify already returns (ASN, route, network type), so it costs no extra API calls. Country names come from `Intl.DisplayNames`, and local time is computed from the UTC offset.
- **Safe rendering of API data.** Website links from the API are rendered only if they are `http(s)` URLs.
- **No extra dependencies.** IPv6 validation uses the browser's built-in URL parser instead of a library.

## Author

**Dewan Mahmud (Rocky)**, founder of Dewan Global LLC dba DewanTech™
Full-Stack Software Engineer and IT Support Specialist, Norcross, Georgia

- Company: https://www.dewantech.com
- Portfolio: https://www.dewanmahmud.com
- GitHub: https://github.com/DewanTechUS

---

© 2026 Dewan Global LLC dba DewanTech™. All rights reserved.
