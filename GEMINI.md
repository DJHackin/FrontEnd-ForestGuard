# GEMINI Project Context: IoT Monitoring Dashboard

This document provides a comprehensive overview of the project to guide future development and modifications.

## Project Overview

This is a full-stack web application designed as a real-time IoT (Internet of Things) monitoring dashboard.

- **Frontend:** A sophisticated single-page application (SPA) built with **React** and **TypeScript**. It features an interactive map (using **React Leaflet**), data visualizations (with **Recharts**), and a modern UI using **Tailwind CSS** and **shadcn/ui** components. It currently uses mocked data, but the `README.md` contains a detailed specification for integrating with a real backend API.
- **Backend:** A minimal **Node.js** server using the **Express** framework. Its primary role is to serve the built frontend application. The `package.json` also includes dependencies for a more robust backend, including **Drizzle ORM** for database access (PostgreSQL), suggesting plans for a full-fledged API.

The `README.md` file contains extensive documentation, including the data models and a complete API design specification for the backend.

## Building and Running

### 1. Installation

Install all the necessary dependencies:

```bash
npm install
```

### 2. Development

To run the application in a development-like environment, use:

```bash
npm run dev
```

This command starts a Node.js server (using `tsx`) that serves the frontend application. The server will be available at `http://localhost:3000`.

**Important Note:** The current `dev` script serves the *statically built* files from the `client/dist` directory. For changes in the frontend code (`client/src`) to be reflected, you must rebuild the project first using `npm run build`. This workflow lacks Hot Module Replacement (HMR). For a more typical Vite development experience with HMR, you might consider running `vite` directly from the `client` directory.

### 3. Building for Production

To create an optimized production build of the frontend application:

```bash
npm run build
```

This command uses Vite to bundle all frontend assets into the `client/dist` directory.

### 4. Running in Production

To start the server in production mode (which serves the pre-built frontend):

```bash
npm run start
```

## Development Conventions

### Type Checking

The project uses TypeScript. You can check for any type-related errors by running:

```bash
npm run check
```

### Backend API

The `server/index.ts` file contains only a minimal Express server for serving static files. The complete specification for the intended backend API, including endpoints, data structures, and WebSocket events, is documented in detail in the main `README.md`. Any backend development should adhere to this specification.

### Database

The project is configured to use **Drizzle ORM**. The `db:push` script suggests a schema management workflow:

```bash
# Pushes schema changes to the database
npm run db:push
```

### Testing

**TODO:** No testing framework (e.g., Jest, Vitest, React Testing Library) is currently configured in `package.json`. A testing strategy should be established to ensure code quality and reliability.
