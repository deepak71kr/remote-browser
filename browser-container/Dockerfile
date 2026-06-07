# 1. Use the official image (Chromium is already installed inside!)
FROM ghcr.io/puppeteer/puppeteer:latest

# 2. Use the safe, default user
USER pptruser
WORKDIR /home/pptruser



# 3. Install ONLY the missing backend tools (unset proxies to prevent ERR_INVALID_URL)
RUN unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY && npm install express socket.io

# 4. Copy your script into the container and ensure the user owns it
COPY --chown=pptruser:pptruser puppeteer-script.js ./

# 5. Expose the port
EXPOSE 8080

# 6. Start the server
CMD ["node", "puppeteer-script.js"]