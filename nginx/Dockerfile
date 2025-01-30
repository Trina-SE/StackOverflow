FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/nginx.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 90
EXPOSE 90

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]