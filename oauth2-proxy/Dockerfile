FROM bitnami/oauth2-proxy

COPY rootCa.pem /etc/

COPY --chmod=755 ssl/ /opt/ssl/

COPY oauth2-proxy.cfg /opt/conf/
