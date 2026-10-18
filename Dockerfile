FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy framework test suite and configuration
COPY . .

# Default command runs the test suite
CMD ["npx", "playwright", "test"]
