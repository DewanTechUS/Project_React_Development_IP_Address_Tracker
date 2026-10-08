# Project Plan — IP Address Tracker (DewanTech™)

## Goal

Build a responsive, accessible IP Address Tracker with React and TypeScript. Users search for an IP address or domain and see its location details on an interactive map.

## Scope

- Fetch geolocation data from the IPify Geolocation API.
- Display results in information cards and on a Leaflet map.
- Support IPv4, IPv6 and domain input with client-side validation.
- Provide persistent light and dark themes.
- Present everything in a consistent DewanTech™ brand: navy, white and cyan palette, branded header and footer.

## Technologies

React, TypeScript, Vite, React Hooks, Context API, Leaflet and react-leaflet, OpenStreetMap, IPify Geolocation API, CSS custom properties, ESLint, Git and GitHub, Render.

## Core Features

- IP and domain search with input validation and URL normalizing
- API fetching with loading states, mapped error messages and request cancellation
- Display of IP address, city, region, country, timezone and ISP
- Interactive map whose marker and center update with each result
- Light and dark theme toggle that persists across visits without flashing
- Responsive layout for mobile, tablet and desktop
- Accessibility: skip link, labelled controls, focus styles, live regions, reduced-motion support

## Architecture

| Layer | Responsibility |
| --- | --- |
| `utils/validators.ts` | Validate IPv4, IPv6 and domains; normalize pasted URLs |
| `lib/ipify.ts` | Build API requests and translate HTTP errors into user-facing messages |
| `hooks/useIpify.ts` | Own data, loading and error state; abort stale requests |
| `context/` | Theme state, persistence and the `useTheme` hook |
| `components/` | Presentational UI: Header, Footer, Logo, SearchBar, InfoCards, MapView, ThemeToggle |
| `lib/brand.ts` | Single source for brand name, copyright and external links |

## Development Phases

1. **Setup.** Vite with React and TypeScript, Git repository, Leaflet dependencies, environment variable for the API key.
2. **Components and types.** Reusable components, shared API response types, theme context.
3. **API integration.** API client, IP and domain detection, error handling and loading states.
4. **UI and state.** Connect search to the data hook, render result cards, sync the map with results, persist the theme.
5. **Design system.** DewanTech™ tokens for navy, white and cyan, light and dark themes, responsive breakpoints, branded header and footer.
6. **Testing and refinement.**
   - Search valid and invalid IPv4, IPv6 and domain inputs.
   - Confirm the map follows rapid consecutive searches.
   - Confirm the theme persists across reloads.
   - Check keyboard navigation and mobile layouts.
7. **Deployment and documentation.** Static deployment on Render, README and planning documentation.

## Testing Checklist

- [ ] Empty search returns the visitor's own IP
- [ ] `8.8.8.8`, `2001:4860:4860::8888` and `example.com` return results
- [ ] `https://example.com/path` is reduced to `example.com`
- [ ] Invalid input such as `256.1.1.1` or `not a domain` shows a validation message without calling the API
- [ ] A missing or invalid API key shows a clear message
- [ ] The theme persists after reload with no flash
- [ ] Layout works at 360px, 768px and 1280px widths

## Future Enhancements

- Search history
- Map tile styling that matches the dark theme
- Backend proxy to keep the API key off the client
