FROM grafana/loki:2.8.2

USER root

RUN mkdir /data

RUN chown loki:loki /data

USER loki

COPY config.yml /etc/loki/local-config.yaml
