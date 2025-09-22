# syntax = docker/dockerfile:1

FROM oven/bun@sha256:a02c6162266611419fd84c8f96dbdbf3029532e2491314dee5172a27223e5428 AS build

WORKDIR /app

RUN apt-get update -qq && \
  apt-get install -y build-essential pkg-config python-is-python3

COPY --link bun.lock package.json ./

RUN bun install --ignore-scripts --frozen-lockfile

COPY --link . .

RUN bun run biome ci . && \
  bun run tsc && \
  bun run build && \
  chmod +x ./bin/main

FROM gcr.io/distroless/base@sha256:cef75d12148305c54ef5769e6511a5ac3c820f39bf5c8a4fbfd5b76b4b8da843

COPY --from=build /app/bin /app/bin
COPY --from=build /app/public /app/public

WORKDIR /app

EXPOSE 3000
ENTRYPOINT ["./bin/main"]
