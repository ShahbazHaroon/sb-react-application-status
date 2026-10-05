# application-status-fe

React + Vite UI that calls the Spring Boot `GET {context-path}/api/v1/status` endpoint.

## Setup
    npm install

## Run (pick the environment)
    npm run dev:local     # uses .env.localhost
    npm run dev:dev       # uses .env.dev
    npm run dev:prod      # uses .env.prod

## Build
    npm run build:local
    npm run build:dev
    npm run build:prod

## Config
All values live in `.env.<mode>` files (must start with `VITE_`).
`src/config/env.js` is the only file that reads them; the rest of the app imports from it.

## Docker (nginx)
    docker build --build-arg APP_MODE=localhost -t application-status-fe:local .
   docker build --build-arg APP_MODE=dev       -t application-status-fe:dev .
   docker build --build-arg APP_MODE=prod      -t application-status-fe:prod .

    docker run -d --name application-status-fe -p 5173:80 application-status-fe:local
    docker run -d --name application-status-fe -p 5173:80 application-status-fe:dev
    docker run -d --name application-status-fe -p 5173:80 application-status-fe:prod
Open http://localhost:5173