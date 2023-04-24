FROM mongo:latest

COPY ssl /etc/ssl

CMD ["mongod", "--sslMode", "requireSSL", "--sslPEMKeyFile", "/etc/ssl/mongodb.crt", "--sslCAFile", "/etc/ssl/rootCa.crt"]
