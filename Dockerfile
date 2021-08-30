FROM node:lts-alpine as frontend-build

WORKDIR /app

COPY ./ /app

RUN  yarn workspaces focus web \
  && yarn workspace web build

FROM node:lts-bullseye

WORKDIR /app

COPY ./ /app

COPY --from=frontend-build /app/packages/web/build /app/packages/server/public
RUN apt-get update && \
  apt-get install -y \
  ffmpeg \
  python3 \
  libjemalloc-dev \
  build-essential \
  && yarn --version\
  && yarn workspaces focus server\
  && yarn workspace server build \
  && yarn cache clean --all \
  && rm -rf /var/lib/apt/lists/* \
  && find /usr/ -name "*jemalloc.so" > /etc/ld.so.preload 

VOLUME ["/images", "/db"]
ENV IMAGE_DIR="/images"
ENV DB_DIR="/db"
ENV PORT=80

ENTRYPOINT [ "yarn", "start" ]