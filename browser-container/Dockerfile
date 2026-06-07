FROM ghcr.io/puppeteer/puppeteer:latest

USER pptruser
WORKDIR /home/pptruser


# only the missing backend tools
RUN unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY && npm install express socket.io

# 4. Copy your script into the container
COPY --chown=pptruser:pptruser puppeteer-script.js ./

EXPOSE 8080

CMD ["node", "puppeteer-script.js"]