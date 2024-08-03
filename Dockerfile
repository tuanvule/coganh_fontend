# Use the official Node.js image based on Alpine Linux for the build stage
FROM node:lts-alpine as build

# Copy only the package.json and package-lock.json files to the container
# This helps leverage Docker's caching strategy, so npm install is only rerun if these files change
COPY package*.json ./

# Install the project dependencies specified in package.json
RUN npm install

# Create a directory for the React application
RUN mkdir /coganh

# Set the working directory to the newly created directory
WORKDIR /coganh

# Copy the entire project into the working directory in the container
COPY . .

# Build the React application, which creates static files in the 'build' directory
RUN npm run build

# Use the official Nginx image based on Alpine Linux for serving the application
FROM nginx:alpine

# Copy the custom Nginx configuration file to the container
COPY ./nginx.conf /etc/nginx/conf.d/configfile.template

# Set environment variables for the port and host
ENV PORT 8080
ENV HOST 0.0.0.0

# Substitute the environment variables in the Nginx configuration template and output to the default configuration file
RUN sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

# Copy the static files from the build stage to the directory Nginx serves files from
COPY --from=build /coganh/build /usr/share/nginx/html

# Expose port 8080 to allow access to the application
EXPOSE 8080

# Start Nginx in the foreground so the container keeps running
CMD ["nginx", "-g", "daemon off;"]