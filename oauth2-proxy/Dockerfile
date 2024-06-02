FROM bitnami/oauth2-proxy:7.6.0

COPY rootCA.pem /etc/

COPY --chmod=755 ssl/ /opt/ssl/

COPY oauth2-proxy.cfg /opt/conf/
