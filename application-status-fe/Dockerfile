# --------------------------------------------------
# Build stage
# --------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

# Selects which .env.<mode> file Vite uses: localhost | dev | prod
ARG APP_MODE
ARG VITE_API_BASE_URL_OVERRIDE=__unset__
RUN test -n "$APP_MODE" || (echo "APP_MODE build arg is required (localhost|dev|prod)" && exit 1)
# RUN if [ "$VITE_API_BASE_URL_OVERRIDE" != "__unset__" ]; then \
#       export VITE_API_BASE_URL="$VITE_API_BASE_URL_OVERRIDE"; \
#     fi; \
#     npx vite build --mode "${APP_MODE}"

# RUN if [ -n "$VITE_API_BASE_URL_OVERRIDE" ] && \
#        [ "$VITE_API_BASE_URL_OVERRIDE" != "__unset__" ]; then \
#       export VITE_API_BASE_URL="$VITE_API_BASE_URL_OVERRIDE"; \
#     fi; \
#     npx vite build --mode "${APP_MODE}"

RUN test -n "$APP_MODE" || \
    (echo "APP_MODE build argument is required" && exit 1)

RUN echo "Building frontend with Vite mode: ${APP_MODE}" && \
    npx vite build --mode "${APP_MODE}"

# --------------------------------------------------
# Runtime stage 2a: serve with Node (NO nginx)
# --------------------------------------------------
FROM node:20-alpine AS node-runtime
WORKDIR /app
RUN npm install -g serve@14
# Copy built app from builder stage
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 5173
# -s = single-page-app fallback to index.html
CMD ["serve", "-s", "dist", "-l", "5173"]

# --------------------------------------------------
# Runtime stage 2b: serve with nginx
# --------------------------------------------------
FROM nginx:1.27-alpine AS nginx-runtime

ARG NGINX_CONF=nginx/nginx.conf

## Remove default config
RUN rm /etc/nginx/conf.d/default.conf
# Copy custom nginx config
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf
# Copy built app from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]