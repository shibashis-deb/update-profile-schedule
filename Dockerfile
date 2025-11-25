FROM mcr.microsoft.com/playwright:v1.56.1-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build typescript (optional if using ts-node in production, but good practice)
# RUN npm run build 

# Set environment variables
ENV NODE_ENV=production

# Run the scheduler
CMD ["npm", "run", "schedule"]
