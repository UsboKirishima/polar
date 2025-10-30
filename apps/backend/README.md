# @polar/backend

## Overview

The **Polar backend** is built with a modern Node.js and TypeScript stack designed for high performance, scalability, and security.  
It relies on **MySQL (or MariaDB)** as the main database and **Redis** for in-memory caching and fast data access.

---

## Prerequisites

Before starting, make sure the required services are installed and running.

### MariaDB Installation

```bash
# Ubuntu / Debian 
sudo apt install mariadb-server 
# Arch Linux 
sudo pacman -S mariadb
```

Enable and start the MariaDB service:

```bash
sudo systemctl enable mariadb.service # Enable at boot 
sudo systemctl start mariadb.service # Start the service 

systemctl status mariadb.service # Check service status
```

---

### Redis Installation

```bash
# Ubuntu / Debian 
sudo apt install redis 
# Arch Linux 
sudo pacman -S redis
```

Enable and start the Redis service:

```bash
sudo systemctl enable redis.service # Enable at boot 
sudo systemctl start redis.service # Start the service 

systemctl status redis.service # Verify it's active
```

---

## Setup

Once the databases are configured, you can proceed to install project dependencies.

### Install Dependencies

```bash
# Install pnpm globally if you don’t have it yet 
npm i -g pnpm 
# Install all project dependencies 
pnpm install
```

### Build the Packages

To build all **Polar** packages:

```bash
pnpm build
```

---

## Environment Configuration

You’ll need to configure environment variables for both the backend and frontend.  
Start by copying the example file:

```bash
cp .env.example .env
```

Then edit `.env` to include your settings:

```bash
NODE_ENV=development 
JWT_ACCESS_SECRET="your-secret" 
DATABASE_URL="mysql://user:password@localhost:3306/polar" 
REDIS_URL="redis://localhost:6379"
#...
```

---

## Running the Applications

Start the backend server:

```bash
cd apps/backend pnpm start
```

Then, in another terminal, start the frontend:

```bash

```