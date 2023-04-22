FROM nginx:latest

COPY conf/ /etc/nginx/conf.d/
COPY ssl/ /etc/ssl/
COPY template-vars /etc/nginx/templates/10-variables.conf.template

RUN head -c 80 /dev/urandom > /etc/nginx_ticketkey
