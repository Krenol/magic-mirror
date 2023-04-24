ARG GRAFANA_VERSION=8.2.6

FROM grafana/grafana:${GRAFANA_VERSION}

USER root

COPY rootCa.crt /usr/local/share/ca-certificates/rootCa.crt

RUN update-ca-certificates

USER grafana

WORKDIR /etc/grafana

COPY provisioning/datasources ./provisioning/datasources

COPY grafana.ini .

COPY ssl /etc/ssl
