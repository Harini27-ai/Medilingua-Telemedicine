# Multi-stage Dockerfile for MediLingua Telemedicine Full-Stack

# --- Stage 1: Build React Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Production Server ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && (npm ci --omit=dev || npm install --omit=dev)

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from Stage 1 into frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

WORKDIR /app/backend
CMD ["node", "server.js"]
