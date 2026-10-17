# Auction House UI

CSI-300 project for browsing an auction catalog and comparing items. Docker Compose starts the app, seeds the local databases, and provides dashboards for the backing services.

## Requirements

- Docker Desktop with Compose
- Node.js LTS (for running the app outside Docker)

## Set up

1. Copy `.env.example` to `.env` and replace the placeholder values with local-only credentials.
   - PowerShell: `Copy-Item .env.example .env`
   - Git Bash/macOS/Linux: `cp .env.example .env`
2. Start the app and its services: `docker compose up --build -d`
3. Check the containers: `docker compose ps`
4. Open the app at `http://localhost:3000`.

Keep `.env` on your machine. It is ignored by Git; commit changes to `.env.example` only. Set a unique local `SESSION_SECRET`; do not use a production credential here.

## Local dashboards

| Service | Address |
|---|---|
| pgAdmin | `http://localhost:5050` |
| Adminer | `http://localhost:8084` |
| Mongo Express | `http://localhost:8082` |
| Redis Commander | `http://localhost:8081` |
| Kafka UI | `http://localhost:8083` |

Use the local `.env` values for dashboard logins. From pgAdmin or Adminer, use `postgres` as the PostgreSQL host because those dashboards run in Docker.

## Useful commands

```bash
docker compose up --build -d  # build and start the stack
docker compose ps             # check status
docker compose logs <name>    # inspect a service
docker compose down           # stop and remove containers
docker compose down -v        # also delete saved database volumes
npm install                   # install app dependencies
npm run dev                   # run app.js with watch mode
npm run web                   # run app.js
```

`docker compose down -v` deletes local database data. Use it only when you intend to reset the project.
