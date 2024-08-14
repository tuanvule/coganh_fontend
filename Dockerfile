# Example Dockerfile with optimizations
# Stage 1: Build the React application
FROM node:lts-alpine AS build

# Set environment variables to ensure production mode and disable source maps
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install the project dependencies
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Set environment variables for the port and host
ENV PORT=8080
ENV HOST=0.0.0.0

# Copy the built React app from the build stage to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file and substitute environment variables
COPY ./nginx.conf /etc/nginx/conf.d/configfile.template
RUN sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

# Expose the port that Nginx will serve the application on
EXPOSE 8080

# Start Nginx in the foreground to keep the container running
CMD ["nginx", "-g", "daemon off;"]
