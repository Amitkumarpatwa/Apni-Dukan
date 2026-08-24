# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build frontend with the appropriate API URL
# Since it's served from the same domain, we can use a relative path /api
ENV VITE_API_BASE_URL=/api
RUN npm run build

# Stage 2: Setup the Express backend and serve the application
FROM node:20-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy backend package files
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source code
COPY backend/ ./backend/

# Copy the built frontend static files from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the port Cloud Run expects
EXPOSE 8080
# Override the PORT variable for the Node.js app
ENV PORT=8080

WORKDIR /app/backend

# Start the application
CMD ["npm", "start"]
