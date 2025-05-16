# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/package*.json ./

# Install production dependencies only
RUN npm ci --production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "build"] 