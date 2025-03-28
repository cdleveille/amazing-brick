# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=latest
FROM oven/bun:${BUN_VERSION} as base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

# Copy application code
COPY --link bun.lockb package.json ./
COPY --link . .

# install all dependencies and run production build
RUN bun install --ignore-scripts --frozen-lockfile
RUN bun run build:prod
RUN bun run compile

# final stage for app image
FROM debian:bullseye-slim

# copy built application
COPY --from=build /app/public /app/public
COPY --from=build /app/main /app/main

# set working directory
WORKDIR /app

# start the server
EXPOSE 3000
ENTRYPOINT ["./main"]
