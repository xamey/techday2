FROM oven/bun:latest

WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN bun install

# Copy the rest of the application
COPY . .

# Expose the port your app runs on (adjust if needed)
EXPOSE 3000

# Run the development server
CMD ["bun", "run", "dev:server"] 