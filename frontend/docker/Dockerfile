ARG NODE_IMG_VERSION=18.9-alpine3.15

FROM node:${NODE_IMG_VERSION} as builder

ENV REACT_APP_NODE_ENV=production

WORKDIR /opt 

COPY . .

RUN yarn install

RUN yarn build

FROM nginx:latest

ENV REACT_APP_NODE_ENV=production

COPY --from=builder /opt/build /var/www/frontend/html

COPY --from=builder /opt/nginx/nginx.conf /etc/nginx/conf.d/frontend.conf

EXPOSE 3000