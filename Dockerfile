FROM node:lts-alpine as frontend-build

WORKDIR /app

COPY ./ /app

RUN  yarn workspaces focus web \
  && yarn workspace web build

FROM node:lts-bullseye

WORKDIR /app

COPY ./ /app

COPY --from=frontend-build /app/packages/web/build /app/packages/server/public
RUN apt update && \
  apt install -y \
  ffmpeg \
  python3 \
  build-essential \
  && yarn --version\
  && yarn workspaces focus server\
  && yarn workspace server build \
  && yarn cache clean --all

VOLUME ["/images", "/db"]
ENV IMAGE_DIR="/images"
ENV DB_DIR="/db"
ENV PORT=80

ENTRYPOINT [ "yarn", "start" ]