FROM oven/bun:1-alpine AS base 
LABEL org.opencontainers.image.source="https://github.com/karasevm/personal-gallery-node"

WORKDIR /app

FROM base AS frontend-build

COPY ./ /app

RUN bun install --filter web --frozen-lockfile
RUN bun web-build

FROM base

COPY ./ /app

RUN bun --version\
  && bun install --frozen-lockfile --production --filter server\
  && bun --filter server build \
  && rm -rf /var/lib/apt/lists/* 

ARG TARGETARCH

RUN apk add --no-cache xz curl tar \
    && if [ "$TARGETARCH" = "arm64" ]; then ARCH="arm64"; else ARCH="amd64"; fi \
    && curl -L "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-${ARCH}-static.tar.xz" \
       | tar xJ --strip-components=1 -C /usr/local/bin --wildcards '*/ffmpeg' \
    && chmod +x /usr/local/bin/ffmpeg

COPY --from=frontend-build /app/packages/web/build /app/packages/server/public

VOLUME ["/images", "/db", "/cache"]
ENV IMAGE_DIR="/images"
ENV DB_DIR="/db"
ENV PORT=80
EXPOSE 80

ENTRYPOINT [ "bun", "/app/packages/server/dist/server.js" ]