## Prerequisites

- Docker with Compose v2 and BuildKit (the default in current Docker versions).
- Ports 5173 and 8080 must be free. Stop one setup before starting another.
- Run each command from the folder shown in its `cd` line.

## Which env file is used where

| Setup | File | How it is used |
|---|---|---|
| Backend standalone | `application-status-be/.env..env.localhost` | `docker run --env-file` (runtime) |
| Frontend standalone | `application-status-fe/.env.<APP_MODE>` (`.env.localhost`, `.env.dev`, `.env.prod`) | `vite build --mode <APP_MODE>` (baked in at image build time) |
| Docker compose | `sb-react-application-status/.env..env.localhost`, `.env.dev`, `.env.prod` | `--env-file` (placeholders) and `env_file:` (backend container) |

Compose `.env..env.localhost` sets `APP_MODE=localhost`, so the FE image is built with `application-status-fe/.env.localhost`.
---
## application-status-be - Run using Docker
Build the Docker image:
```bash
cd application-status-be
docker build -t application-status-be:1.0 .
```
Run the Docker container using the `.env..env.localhost` file:
```bash
docker rm -f application-status-be 2>/dev/null
docker run -d --name application-status-be -p 8080:8080 --env-file .env.localhost application-status-be:1.0
```
Run the Docker container using the `.env.dev` file:
```bash
docker rm -f application-status-be 2>/dev/null
docker run -d --name application-status-be -p 8080:8080 --env-file .env.dev application-status-be:1.0
```
Run the Docker container using the `.env.prod` file:
```bash
docker rm -f application-status-be 2>/dev/null
docker run -d --name application-status-be -p 8080:8080 --env-file .env.prod application-status-be:1.0
```
Access the application:
```
http://localhost:8080/app/api/v1/status
```
View logs and stop:
```bash
docker logs -f application-status-be
docker rm -f application-status-be
```
---
## application-status-fe - Run using Docker
Start the backend first (section above). The .env.localhost build calls `http://localhost:8080`, and the backend allows the `http://localhost:5173` origin.
Build and run using the `.env.localhost` file:
```bash
cd application-status-fe
docker build --build-arg APP_MODE=localhost -t application-status-fe:localhost .
docker build --no-cache --build-arg APP_MODE=localhost -t application-status-fe:localhost .
docker rm -f application-status-fe 2>/dev/null
docker run -d --name application-status-fe -p 5173:80 application-status-fe:localhost
```
Build and run using the `.env.dev` file:
```bash
docker build --build-arg APP_MODE=dev -t application-status-fe:dev .
docker rm -f application-status-fe 2>/dev/null
docker run -d --name application-status-fe -p 5173:80 application-status-fe:dev
```
Build and run using the `.env.prod` file:
```bash
docker build --build-arg APP_MODE=prod -t application-status-fe:prod .
docker rm -f application-status-fe 2>/dev/null
docker run -d --name application-status-fe -p 5173:80 application-status-fe:prod
```
Access the application (all three):
```
http://localhost:5173
```
> Dev and prod images call the API URL baked in from `.env.dev` / `.env.prod`
> (`https://dev-api.example.com` and `https://api.example.com` are placeholders).
> The page loads locally, but the status call only succeeds once these point to a real API.
---

## Docker compose: No Nginx (frontend served by Node `serve`)
Build and run using the `.env.localhost` file:
```bash
cd sb-react-application-status
docker compose --env-file .env..env.localhost up -d --build
docker compose --env-file .env..env.localhost down
```
Build and run using the `.env.dev` file:
```bash
docker compose --env-file .env.dev up -d --build
docker compose --env-file .env.dev down
```
Build and run using the `.env.prod` file:
```bash
docker compose --env-file .env.prod up -d --build
docker compose --env-file .env.prod down
```
Access the application (all three):
```
http://localhost:5173
```
```bash
curl http://localhost:8080/app/api/v1/status
```
---
## Docker compose with Nginx
Build and run using the `.env.localhost` file:
```bash
cd sb-react-application-status
docker compose --env-file .env..env.localhost -f docker-compose.nginx.yml up -d --build
docker compose --env-file .env..env.localhost -f docker-compose.nginx.yml down
```
Build and run using the `.env.dev` file:
```bash
docker compose --env-file .env.dev -f docker-compose.nginx.yml up -d --build
docker compose --env-file .env.dev -f docker-compose.nginx.yml down
```
Build and run using the `.env.prod` file:
```bash
docker compose --env-file .env.prod -f docker-compose.nginx.yml  up -d --build
docker compose --env-file .env.prod -f docker-compose.nginx.yml down
```
Access the application (all three):
```
http://localhost:5173
```
```bash
curl http://localhost:8080/app/api/v1/status
```
---
## Docker compose with Nginx and Reverse proxy
The backend port is not published. Nginx forwards `/app/` to the backend, and the UI calls the API on the same origin.
Build and run using the `.env.nginx.reverse.proxy` file:
```bash
cd sb-react-application-status
docker compose --env-file .env.nginx.reverse.proxy -f docker-compose.nginx.reverse.proxy.yml up -d --build
docker compose --env-file .env.nginx.reverse.proxy -f docker-compose.nginx.reverse.proxy.yml down
```
Access the application:
```
http://localhost:5173
```
```bash
curl http://localhost:5173/app/api/v1/status
```
---
## Troubleshooting

```bash
# Validate YAML and variable substitution before starting
docker compose --env-file .env..env.localhost config

# Backend / frontend logs
docker logs -f <APP_NAME>-backend
docker logs -f <APP_NAME>-frontend
```