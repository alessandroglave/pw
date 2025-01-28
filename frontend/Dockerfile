ARG nodeversion=node:20.2.0-alpine

# Install dependencies
FROM $nodeversion AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code
FROM $nodeversion AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# get BUILD ARGS from docker build script to set ENV variables used during build phase
ARG NEXT_PUBLIC_WEBSITE_URL
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXTAUTH_SECRET

ENV NEXT_PUBLIC_WEBSITE_URL=$NEXT_PUBLIC_WEBSITE_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Build
RUN npm run build

# Runner
FROM $nodeversion AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "start"]
