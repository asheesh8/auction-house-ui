# Auction House — Backend Setup

## Prerequisites

Each team member needs these installed:

| Tool | Download |
|------|----------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Runs all the databases |
| [Node.js LTS](https://nodejs.org/) | Runs your JavaScript code |

---

## First-time setup

1. **Clone the repo** and open a terminal in the project folder.

2. **Install JS dependencies:**
   ```bash
   npm install
   ```

4. **Start all databases:**
   ```bash
   docker compose up -d
   ```
   The `-d` flag runs them in the background. First run will download the images (~a few minutes).

5. **Verify everything is running:**
   ```bash
   docker compose ps
   ```
   All services should show `running`.

---

## Services & ports

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | `5432` | Relational database |
| MongoDB | `27017` | Document database |
| Redis | `6379` | In-memory key/value store |
| Kafka | `9092` | Message broker |

## UI Dashboards (open in browser)

| Dashboard | URL | Login |
|-----------|-----|-------|
| pgAdmin (Postgres) | http://localhost:5050 | `admin@admin.com` / `admin` |
| Adminer (Postgres) | http://localhost:8084 | System: `PostgreSQL`, Server: `postgres`, Username/Password/Database: from `.env` |
| Mongo Express | http://localhost:8082 | none |
| Redis Commander | http://localhost:8081 | none |
| Kafka UI | http://localhost:8083 | none |

> **pgAdmin first login:** After signing in, you need to add a server manually.
> Right-click Servers → Register → Server.
> - Name: `auction-house`
> - Host: `postgres`  (not localhost — Docker uses the service name)
> - Port: `5432`
> - Username: `admin`
> - Password: `admin`

---

## Docker commands

```bash
# Start databases (do this before running your code)
docker compose up -d

# Check services are running
docker compose ps

# Stop databases (just pausing them basically)
docker compose stop

# Full stop + remove containers (data still saved in volumes)
docker compose down

# Wipe ALL data and start fresh
docker compose down -v
```

---

## The .env file

The `.env` file in the root of the project stores credentials (database usernames, passwords, etc.). Instead of hardcoding these values directly in your code, you read them via `process.env.VARIABLE_NAME`. The `dotenv` library loads the `.env` file automatically when your code runs.

At the top of your `client.js`, add:
```js
import dotenv from 'dotenv'
dotenv.config()
```

Then you can use any variable from `.env` like:
```js
process.env.POSTGRES_USER      // 'admin'
process.env.POSTGRES_PASSWORD  // 'admin'
```

This means all credentials are defined in one place — if something changes, you update `.env` and nothing else.

---

## Documentation

See [docs.md](docs.md) for links to each database client library's documentation.

---

## Troubleshooting

- **Docker not starting** — make sure Docker Desktop is open and running before running `docker compose` commands.
- **Containers keep restarting** — run `docker compose logs <service-name>` to see the error (e.g. `docker compose logs kafka`).
