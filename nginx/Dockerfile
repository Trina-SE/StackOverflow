# Use the official Nginx image as the base image
FROM nginx:stable-alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy additional configuration if needed
COPY conf.d/ /etc/nginx/conf.d/

# Expose port 80
EXPOSE 80
