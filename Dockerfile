FROM oven/bun:1 AS base 

WORKDIR /app

FROM base AS frontend-build
COPY ./ /app

RUN bun install --filter web --frozen-lockfile
RUN bun web-build

FROM base

COPY ./ /app

COPY --from=frontend-build /app/packages/web/build /app/packages/server/public
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  && apt-get clean \
  bun --version\
  && bun install --frozen-lockfile --omit=dev --filter server\
  && bun --filter server build \
  && rm -rf /var/lib/apt/lists/* 

VOLUME ["/images", "/db", "/cache"]
ENV IMAGE_DIR="/images"
ENV DB_DIR="/db"
ENV PORT=80

ENTRYPOINT [ "bun", "start" ]