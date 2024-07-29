# # Install dependencies only when needed
# FROM node:20-alpine AS deps
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install

# # Rebuild the source code only when needed
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY . .
# COPY --from=deps /app/node_modules ./node_modules
# RUN npm run build

# # Production image, copy all the files and run next
# FROM node:20-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV production

# # Copy the pre-built files from the builder stage
# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/prisma ./prisma

# # Copy the .env file to the container
# COPY .env .env

# # Start the Next.js server
# CMD ["npm", "start"]


# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 80

# Start the application
CMD ["npm", "start"]

