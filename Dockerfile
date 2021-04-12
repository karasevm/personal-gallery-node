FROM node:lts-alpine as frontend-build

WORKDIR /app

COPY ./ /app

RUN  yarn workspaces focus web \
  && yarn workspace web build

FROM node:lts-alpine

WORKDIR /app

COPY ./ /app

COPY --from=frontend-build /app/packages/web/build /app/packages/server/public
RUN apk add --update-cache \
  ffmpeg \
  python3 \
  build-base \
  && yarn --version\
  && yarn workspaces focus server\
  && yarn workspace server build \
  && yarn cache clean --all\
  && rm -rf /var/cache/apk/* \
  && apk del \
  python3 \
  build-base 

VOLUME ["/images", "/db"]
ENV IMAGE_DIR="/images"
ENV DB_DIR="/db"
ENV PORT=80

ENTRYPOINT [ "yarn", "start" ]