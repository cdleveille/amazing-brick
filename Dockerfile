# syntax=docker/dockerfile:1

# Use bun image for throw-away build stage
FROM oven/bun@sha256:a02c6162266611419fd84c8f96dbdbf3029532e2491314dee5172a27223e5428 AS build

WORKDIR /app

# Install packages needed to build dependencies
RUN apt-get update -qq && \
    apt-get install -y \
    build-essential \
    pkg-config \
    python-is-python3

# Copy application code
COPY --link bun.lock package.json ./
COPY --link . .

# Install dependencies, lint project, build frontend, and compile backend
RUN bun install --ignore-scripts --frozen-lockfile && \
    bun run biome ci . && \
    bun run tsc && \
    bun run build && \
    bun run compile && \
    chmod +x ./main

# Minimalist final stage for app image
FROM gcr.io/distroless/base@sha256:cef75d12148305c54ef5769e6511a5ac3c820f39bf5c8a4fbfd5b76b4b8da843

# Copy built application
COPY --from=build /app/main /app/main
COPY --from=build /app/public /app/public

WORKDIR /app

# Start the server
EXPOSE 3000
ENTRYPOINT ["./main"]
