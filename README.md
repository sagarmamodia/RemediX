# RemediX

RemediX is a full‑stack health/consultation web application that provides patient and doctor workflows including authentication, booking, dashboards and consultation management. The project is split into two main parts:

- `client` — a TypeScript React front end (Vite, TailwindCSS).
- `server` — a Node + TypeScript backend (see `server/app.ts` and `server/server.ts`).

This README gives an overview of the project, how to run it locally, and where to look to extend or contribute.
## Team Members and Roles

- Sagar: Backend and Deployment
- Ritik Dangi: Frontend and Designing
- Sahil Adlakha: API Development, Testing and Documentation

## Table of contents

- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local setup (client)](#local-setup-client)
  - [Local setup (server)](#local-setup-server)
  - [Running both together](#running-both-together)
- [Environment variables](#environment-variables)
- [Project details & important files](#project-details--important-files)
- [Development notes](#development-notes)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Maintainer / Contact](#maintainer--contact)

## Key features

Based on the current codebase, RemediX includes:

- User authentication (Login / Register).
- Role-based dashboards (Doctor and Patient dashboards).
- Booking flow for patients.
- Room page (for consultation sessions or similar functionality).
- Protected routes to guard authenticated/role-based pages.
- Rich doctor dashboard sections (Overview, Profile, Consultations).
- Client-side state management and API services structure (contexts & services directories exist).

## Tech stack

Client
- React + TypeScript (Vite)
- Tailwind CSS
- PostCSS
- ESLint configuration present

Server
- Node + TypeScript
- Server entry points: `server/app.ts`, `server/server.ts`
- `.env.example` in `server/` indicates environment configuration

Other
- Vercel configuration for the client (`client/vercel.json`)
- Project contains `testing/` folder for tests

## Repository layout

- client/
  - src/
    - pages/ (Landing, Login, Register, BookingPage, Room, About, Contact, Dashboard)
    - components/ (Navbar, Layout, ProtectedRoute, doctor & patient component subfolders)
    - context/ (app-level state)
    - services/ (API calls)
    - assets/, utils/, types/
  - vite.config.ts, tailwind.config.js, postcss.config.js, eslint.config.js
  - .env.example
- server/
  - app.ts
  - server.ts
  - src/ (backend source)
  - .env.example
  - tsconfig.json
- testing/ (tests / test setup)
- README.md (this file)

## Getting started

### Prerequisites

- Node.js (>= 16 recommended)
- npm (comes with Node) or yarn
- A database (if the backend requires one — check `server/.env.example` for required variables)
- (Optional) Vercel account for deploying the client

### Local setup (client)

1. Open a terminal and clone the repo:
   git clone https://github.com/sagarmamodia/RemediX.git
2. Start the front end:
   cd RemediX/client
   npm install
   cp .env.example .env    # then edit .env with your values
   npm run dev

The client is a Vite + React + TypeScript app. Common scripts: `dev`, `build`, `preview`. If linting/formatting scripts are present, run `npm run lint` / `npm run format` as appropriate.

### Local setup (server)

1. In another terminal:
   cd RemediX/server
   npm install
   cp .env.example .env    # then edit .env with your values (DB connection, JWT secrets, etc.)
   npm run dev

The server includes TypeScript setup (see `tsconfig.json`) and entry files `app.ts` and `server.ts`. Typical scripts are `dev` (watch / ts-node-dev) and `start` (compiled Node). Check `server/package.json` for exact script names.

### Running both together

- Start the backend first, then the frontend. Configure the client's API base URL (often via `.env`) to point to your running backend (e.g., `http://localhost:4000` or whichever PORT the server uses).

## Environment variables

Both `client/.env.example` and `server/.env.example` exist. Copy them to `.env` in each folder and fill required values.

Typical server variables (examples — check `server/.env.example` for exact names):
- PORT
- DATABASE_URL or MONGO_URI
- JWT_SECRET
- SMTP/EMAIL credentials (if used)
- Third-party API keys (if used)

Client `.env` commonly contains:
- VITE_API_BASE_URL (or similar) — the backend API base URL

Always keep secrets out of source control.

## Project details & important files

Client
- `client/src/pages/` — main page components:
  - `Landing.tsx` — public landing page
  - `Login.tsx`, `Register.tsx` — authentication
  - `BookingPage.tsx` — booking flow
  - `Room.tsx` — consultation/room UI
  - `Dashboard/DoctorDashboard.tsx`, `Dashboard/PatientDashboard.tsx` — dashboards
- `client/src/components/ProtectedRoute.tsx` — guards private routes
- `client/src/components/doctor/dashboard/*` — doctor dashboard sections:
  - `OverviewSection.tsx`, `ProfileSection.tsx`, `ConsultationsSection.tsx`
- `client/vite.config.ts`, `tailwind.config.js`, `postcss.config.js`
- `client/vercel.json` — client deployment configuration

Server
- `server/app.ts` — application setup (middleware, routes registration)
- `server/server.ts` — server bootstrap
- `server/.env.example` — required server environment variables
- `server/src/` — backend source code (APIs, models, controllers)

Testing
- `testing/` — contains tests or test helpers (check contents for test runner and instructions)

## Development notes

- Role-aware UI: The presence of doctor/patient dashboards and `ProtectedRoute` indicates role-based navigation and protected endpoints on the server. When modifying auth, update both client context/services and server auth middleware.
- API services live in `client/src/services/`. Keep shapes/types synchronized between client and server; shared TypeScript types or a codegen approach can help.
- ESLint and TypeScript configs exist in the client — keep lint rules and tsconfig consistent for a good DX.
- The client is configured for Vercel (see `client/vercel.json`); you can deploy the front end independently.

## Testing

- Inspect the `testing/` directory. Depending on what test framework is used there will be npm scripts in `client/package.json` or `server/package.json` such as `test`, `test:watch`, etc.
- Run tests from the relevant directory:
  cd client
  npm run test
  or
  cd server
  npm run test

If there are no test scripts, add your preferred test runner (Jest, Vitest, etc.).

## Deployment

- Client: configured for Vercel (see `client/vercel.json`). You can also build the client and serve the static files from the server if you prefer:
  cd client
  npm run build
  # then serve the `dist`/`build` artifact

- Server: containerize or deploy to Node hosts (Heroku, DigitalOcean, Railway, etc.). Make sure to set environment variables from `server/.env.example` in your deployment environment.

## Contributing

Contributions are welcome. A suggested workflow:

1. Fork the repository.
2. Create a feature branch: git checkout -b feat/your-feature
3. Implement your changes, follow existing code style and linting rules.
4. Add or update tests.
5. Open a Pull Request with a clear description of the changes.

Please open issues for feature requests, bugs, or design discussions.

## License

No LICENSE file detected in the repository root. Add a LICENSE (for example, the MIT license) to make the project’s license explicit.

## Maintainer / Contact

Repository: https://github.com/sagarmamodia/RemediX

If you have questions or want to collaborate, open an issue or submit a PR.

