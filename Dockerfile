# Stage 1: Build environment
FROM node:18-alpine AS builder

# Install dependencies for node-gyp (without version pinning)
RUN apk add --no-cache --update \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Create and set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install production dependencies with retry logic
RUN npm cache clean --force && \
    (npm ci --only=production --ignore-scripts || \
     npm install --only=production --ignore-scripts)

# Stage 2: Runtime environment
FROM node:18-alpine

# Security hardening
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    apk add --no-cache tini && \
    rm -rf /var/cache/apk/*

ENTRYPOINT ["/sbin/tini", "--"]

# Set working directory
WORKDIR /app

# Copy from builder with proper permissions
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup . .

# Verify critical files exist
RUN test -f package.json && \
    test -f src/server.js

USER appuser

EXPOSE 3000
CMD ["node", "src/server.js"]


# # Stage 1: Build environment
# FROM node:18-alpine AS builder

# # Install dependencies for node-gyp and security updates
# RUN apk add --no-cache --update \
#     python3 \
#     make \
#     g++ \
#     && rm -rf /var/cache/apk/*

# # Create and set working directory
# WORKDIR /app

# # Copy package files first for better layer caching
# COPY package*.json ./

# # Install production dependencies only
# RUN npm ci --only=production --ignore-scripts

# # Stage 2: Runtime environment
# FROM node:18-alpine

# # Security hardening:
# # 1. Create non-root user
# # 2. Set secure permissions
# # 3. Remove unnecessary packages
# RUN addgroup -S appgroup && \
#     adduser -S appuser -G appgroup && \
#     apk add --no-cache tini && \
#     rm -rf /var/cache/apk/*

# # Install dumb-init for proper signal handling
# ENTRYPOINT ["/sbin/tini", "--"]

# # Set secure environment variables
# ENV NODE_ENV=production \
#     PORT=3000 \
#     HOST=0.0.0.0 \
#     NPM_CONFIG_PRODUCTION=true \
#     NPM_CONFIG_LOGLEVEL=warn \
#     NPM_CONFIG_AUDIT=false \
#     NPM_CONFIG_FUND=false

# # Set working directory
# WORKDIR /app

# # Copy from builder
# COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
# COPY --chown=appuser:appgroup . .

# # Secure file permissions
# RUN chmod -R 750 /app && \
#     find /app -type d -exec chmod 750 {} \; && \
#     find /app -type f -exec chmod 640 {} \; && \
#     chmod 750 /app/src/server.js

# # Switch to non-root user
# USER appuser

# # Health check
# HEALTHCHECK --interval=30s --timeout=3s \
#     CMD curl -f http://localhost:${PORT}/health || exit 1

# # Expose port (non-privileged)
# EXPOSE 3000

# # Run the application
# CMD ["node", "src/server.js"]