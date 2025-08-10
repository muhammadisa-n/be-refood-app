FROM node:22-slim AS base

# Install timezone data
RUN apt-get update && apt-get install -y tzdata openssl

# Set timezone
ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

# Copy package.json dan package-lock.json lalu install dependencies production
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 18000

CMD ["node", "src/index.js"]
