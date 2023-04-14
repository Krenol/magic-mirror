FROM nginx:latest

COPY conf/ /etc/nginx/conf.d/
COPY ssl/ /etc/ssl/

RUN head -c 80 /dev/urandom > /etc/nginx_ticketkey
