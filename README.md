# React Development Project - IP Address Tracker

# Author

Dewan Mahmud (Rocky)
Software Engineer in Training - Per Scholas

## Live Demo

https://dewantechus.netlify.app/

## Repository

GitHub: https://github.com/DewanTechUS/Project_React_Development_IP_Address_Tracker

# Project Overview

This project is a responsive IP Address Tracker built with React and TypeScript. It allows users to search for any IP address or domain name and view its geographic location on an interactive map. The application integrates with the IPify Geolocation API for data retrieval and LeafletJS for real-time map rendering. It also includes light and dark theme support using React Context and CSS variables.

# Features

Search any IP address or domain name
Display IP address, city, region, country, timezone, and ISP
Interactive map with dynamic marker updates
Light and dark mode toggle with persistent user preference
Real-time API data fetching with loading and error handling
Fully responsive design for mobile, tablet, and desktop
Basic accessibility support with ARIA labels and keyboard-friendly controls

# Tech Stack

React 
TypeScript
Vite
React Hooks (useState, useEffect, useContext)
Context API for global theme management
Leaflet and react-leaflet for map rendering
IPify Geolocation API
CSS with custom responsive styling
Git and GitHub for version control

# Environment Variables

This project uses an environment variable to store the IPify API key.
Create a .env file in the project root and add the following:
VITE_IPIFY_API_KEY=DEWAN_MAHMUD_ROCKY

# Security note:

The .env file is intentionally not committed to version control and is included in .gitignore to keep sensitive keys private.

# Getting Started (Local Setup)

1. Clone the repository
git clone https://github.com/DewanTechUS/Project_React_Development_IP_Address_Tracker
cd  (to the root)

2. Install dependencies
npm install

3. Run the development server
npm run dev

Open your browser at:
http://localhost:5173

# Deployment

This project can be deployed as a static site using:
Netlify for deployment
Build command:
npm run build
Output directory:
dist

# Reflection

This project builds on work I initially started during an earlier SBA, which allowed me to approach this assignment with a clearer understanding of the problem space. Rather than reusing existing code, I rebuilt and refactored the application from the ground up using React and TypeScript. This process involved restructuring components, improving state management, and applying cleaner, more scalable architectural patterns aligned with the React Development project requirements. Having prior experience with a similar version helped streamline development while still resulting in a fresh, well-organized implementation.

Through this project, I reinforced core React concepts such as component composition, state management with hooks, handling side effects with useEffect, and managing global state using the Context API. Integrating an external API and rendering location data on an interactive map deepened my understanding of asynchronous data fetching, loading states, and error handling. One notable challenge was keeping the map view synchronized with updated API results, which I resolved by dynamically re-centering the Leaflet map whenever new coordinates were received. Implementing a light and dark theme using CSS variables and persistent state further strengthened my understanding of global UI state management.

Looking ahead, I would enhance this project by adding search history, improving accessibility, and providing more detailed, user-friendly error feedback. These improvements would help make the application more robust, inclusive, and production-ready.

# Special Thanks

Special thanks to Tishana Trainor and Bryan Santos for their clear instruction, guidance, and support throughout my JavaScript and frontend development learning journey.

Grateful as well to the Per Scholas community for providing a structured and supportive learning environment.


# Project Planning

The initial planning and breakdown for this project is documented in the file below:

Project_Planning.md - outlines the project goals, scope, feature breakdown, development phases, and future enhancements.

