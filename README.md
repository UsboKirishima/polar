# Polar Social Network Platform

Welcome to the Polar Social Network Platform! This is a modern, type-safe, and scalable social network built on a TypeScript-first monorepo.

Our mission is to foster authentic connections through a seamless, high-performance, and secure user experience.

## Technology Stack

The platform is built on a robust, modern technology stack chosen for performance, scalability, and developer experience.

| Category | Technology | Justification |
|---|---|---|
| **Monorepo** | **PNPM Workspaces & Turborepo** | Efficient dependency management and incremental, cached builds. |
| **API** | **tRPC** | End-to-end type-safe APIs without schema generation. |
| **Backend** | **Node.js, TypeScript, Express.js** | High-performance I/O, running the tRPC server. |
| **Frontend** | **React, TypeScript, Vite** | Modern component architecture with a lightning-fast dev environment. |
| **Database ORM** | **Prisma** | Type-safe database client and declarative schema management. |
| **Database** | **PostgreSQL** | A reliable and feature-rich relational database. |
| **Caching** | **Redis** | High-performance in-memory cache for sessions and frequent queries. |
| **Deployment** | **Docker & Nginx** | Containerized services for consistent environments and routing. |

## Monorepo Structure

The project is organized as a PNPM/Turborepo monorepo to promote code sharing and developer velocity.

```
/
├── apps/                 # Deployable applications (backend, frontend)
├── packages/             # Shared libraries (db, api, types, utils)
├── docs/                 # Detailed documentation guides
├── .github/              # CI/CD Workflows
├── CONTRIBUTING.md       # Contributor guidelines
└── README.md             # This file
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18+)
- PNPM (v8+)
- Docker and Docker Compose

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd polar
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Start backing services (PostgreSQL & Redis):**
    ```bash
    docker-compose up -d
    ```

4.  **Configure Environment Variables:**
    Copy all `.env.example` files to `.env` in their respective `apps/*` directories.
    ```bash
    cp apps/backend/.env.example apps/backend/.env
    ```

5.  **Run database migrations:**
    This command applies any pending database schema changes.
    ```bash
    pnpm --filter @polar/db exec prisma migrate dev
    ```

6.  **Start all applications in development mode:**
    This will start the backend and frontend with hot-reloading.
    ```bash
    pnpm dev
    ```
    Your frontend should now be available at `http://localhost:5173` and the backend is listening for tRPC requests.

## Further Documentation

- **[Contribution Guidelines](./CONTRIBUTING.md)**: How to contribute, our Git workflow, and coding standards.
- **[Backend Architecture](./apps/backend/README.md)**: In-depth guide to the backend service.
- **[Frontend Architecture](./apps/frontend/README.md)**: In-depth guide to the frontend application.
- **[API Guide](./packages/api/README.md)**: How to use and define tRPC API procedures.
- **[Database Guide](./docs/DATABASE.md)**: Information on the database schema, migrations, and seeding.
- **[Deployment Guide](./docs/DEPLOYMENT.md)**: Details on our CI/CD, deployment, and operational practices.
