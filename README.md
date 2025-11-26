<div align="center">
  <img src="./assets/screen1.png" alt="Polar" width="600" />
  
  # **Polar**
  
  [![License: P-RUAL](https://img.shields.io/badge/P-RUAL-yellow.svg)](/LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
  [![pnpm](https://img.shields.io/badge/pnpm-10.20.0-orange.svg)](https://pnpm.io/)
  [![Turborepo](https://img.shields.io/badge/Turborepo-2.5.6-blueviolet.svg)](https://turbo.build/)
  
  A modern full-stack social platform to connect with nearby friends based on location.
  
  [🌐 polar](https://polar.usbo.tech) | [📱 Frontend](./apps/frontend/) | [⚡ Backend](./apps/backend/) | [🎨 License](/LICENSE)
</div>

---

> [!WARNING] There is currently **no stable release** of **Polar** available.  
> Expect breaking changes, incomplete features, and frequent updates.

## ✨ Features

- 🚀 **Share & Engage**: Create posts, leave comments, and show appreciation with likes
- 👤 **Profile Customization**: Personalize your profile to express yourself
- 🔍 **Discover People**: Find and connect with new friends and interesting people
- 💬 **Real-time Chat**: Communicate instantly with your friends
- 📍 **Location-based Discovery**: Find people nearby and potentially find your next date!
- 🏗️ **Modern Architecture**: Built with TypeScript, tRPC, Vue.js, and Express.js

## 🏗️ Architecture

This is a **monorepo** built with modern tools and best practices:

### 🛠️ Tech Stack

- **Frontend**: Vue.js 3 + TypeScript + Vite + Pinia
- **Backend**: Node.js + Express.js + TypeScript + tRPC
- **Database**: MariaDB + Prisma ORM
- **Caching**: Redis
- **Authentication**: Better Auth + JWT
- **File Storage**: ImageKit
- **Monorepo**: Turborepo + pnpm workspaces
- **Type Safety**: Full end-to-end type safety with tRPC

### 📁 System design

![tech_stack](/assets/tech_stack.jpg)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: >= 20.0.0
- **pnpm**: >= 10.0.0
- **MariaDB**: Latest stable version
- **Redis**: Latest stable version

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/UsboKirishima/polar.git
    cd polar
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    ```

3. **Set up environment variables**

    ```bash
    # Copy example environment files
    cp apps/backend/.env.example apps/backend/.env
    cp apps/frontend/.env.example apps/frontend/.env

    # Edit the files with your configuration
    ```

4. **Set up the database**

    ```bash
    # Generate Prisma client
    pnpm db:generate

    # Run database migrations
    pnpm db:migrate
    ```

5. **Start development servers**

    ```bash
    # Start all services in development mode
    pnpm dev

    # Or start individual services
    pnpm dev --filter=@polar/backend
    pnpm dev --filter=@polar/frontend
    ```

### Code Standards

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Antfu's ESLint config with custom rules
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Follow conventional commit format

## 🔧 Configuration

### Environment Variables

#### Backend (`apps/backend/.env`)

```bash
# Database
DATABASE_URL="mariadb://user:password@localhost:5432/polar"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-jwt-secret"
BCRYPT_ROUNDS=12

# ImageKit (for file uploads)
IMAGEKIT_PUBLIC_KEY="your-public-key"
IMAGEKIT_PRIVATE_KEY="your-private-key"
IMAGEKIT_URL_ENDPOINT="your-url-endpoint"

# Server
PORT=3000
NODE_ENV="development"
```

#### Frontend (`apps/frontend/.env`)

```bash
# API Configuration
VITE_API_URL="http://localhost:3000"
VITE_WS_URL="ws://localhost:3000"

# Environment
NODE_ENV="development"
```

### Database Schema

The database schema is defined in `packages/db/src/schema.prisma`. Key entities:

- **User**: User accounts and profiles
- **Post**: User posts and content
- **Comment**: Comments on posts
- **Like**: Post and comment likes
- **Chat**: Direct messaging
- **Location**: User location data

## 🚀 Deployment

### Production Build

```bash
# Build applications (packages are consumed as-is)
pnpm build

# Build for production with optimizations
NODE_ENV=production pnpm build
```

### Docker Deployment

```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d
```

### Environment-specific Builds

```bash
# Staging
pnpm build --filter=@polar/backend
pnpm build --filter=@polar/frontend

# Production
NODE_ENV=production pnpm build --filter=@polar/backend
NODE_ENV=production pnpm build --filter=@polar/frontend
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository** and create your feature branch
2. **Follow the code standards** and run linting/formatting
3. **Write tests** for new functionality
4. **Update documentation** as needed
5. **Submit a pull request** with a clear description

### Development Setup for Contributors

1. Follow the Quick Start guide above
2. Install development dependencies: `pnpm install`
3. Set up pre-commit hooks: `pnpm prepare`
4. Make your changes and ensure all tests pass: `pnpm test`

**Working with Packages:**

- Changes to packages are immediately visible (no build step!)
- Type checking works across the entire monorepo
- Just save your `.ts` files and restart the consuming application
- Use `pnpm type-check` to verify types across all packages

## 📚 Documentation

- **API Documentation**: See `apps/backend/docs/`
- **Component Documentation**: See `apps/frontend/docs/`
- **Package Documentation**: Each package has its own README
- **Architecture Decision Records**: See `docs/adr/`

## 🐛 Troubleshooting

### Common Issues

1. **TypeScript errors**: Run `pnpm type-check` to identify issues across packages
2. **Module resolution issues**: Clear node_modules and reinstall (`pnpm clean && pnpm install`)
3. **Database connection**: Verify MariaDB is running and connection string is correct
4. **Redis connection**: Ensure Redis server is running

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/UsboKirishima/polar/issues)
- **Discussions**: [GitHub Discussions](https://github.com/UsboKirishima/polar/discussions)
- **Documentation**: Check package-specific READMEs

## 📄 License

This project is licensed under the Polar Restricted Use and Attribution License (P-RUAL) - see the
[LICENSE](./LICENSE) file for details.

## 👤 Author

**Davide Usberti**

- Website: [usbo.tech](https://usbo.tech)
- Email: usbertibox@gmail.com
- GitHub: [@UsboKirishima](https://github.com/UsboKirishima)

---

<div align="center">
  Made with ❤️ by <a href="https://usbo.tech">Davide Usberti</a>
  
  ⭐ Star this project if you find it helpful!
</div>
