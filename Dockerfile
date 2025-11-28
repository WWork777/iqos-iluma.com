# --------------------------
# 1) Build stage
# --------------------------
FROM node:18-alpine AS builder

# App directory
WORKDIR /app

# Install deps only once
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build Next.js
RUN npm run build


# --------------------------
# 2) Run (production) stage
# --------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only what needed for running
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Production ENV
ENV NODE_ENV=production
ENV PORT=3002

EXPOSE 3002

CMD ["npm", "start"]
