const puppeteer = require('puppeteer');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = 8080;

(async () => {
    console.log("Launching the hidden browser...");
    const browser = await puppeteer.launch({
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // required for docker
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768 });
    landing_page = 'https://www.teambld.in/'
    await page.goto(landing_page, { waitUntil: 'networkidle2' });

    console.log("Browser ready. Waiting for React frontend to connect...");

    io.on('connection', (socket) => {
        console.log('React App Connected!');
        
        socket.on('mouseClick', async ({ x, y }) => {
            try {
                await page.mouse.click(x, y);
            } catch (err) {
                console.error("Click error:", err);
            }
        });

        socket.on('keyPress', async (key) => {
            try {
                await page.keyboard.press(key);
            } catch (err) {
                console.error("Keyboard error:", err);
            }
        });

        const streamInterval = setInterval(async () => {
            try {
                const screenshot = await page.screenshot({ encoding: 'base64' });
                socket.emit('stream', screenshot);
            } catch (err) {
                // suppress errors that naturally happen during page loads/navigations
            }
        }, 200);

        socket.on('disconnect', () => {
            console.log('React App Disconnected!');
            clearInterval(streamInterval);
        });
    });

    // bind to 0.0.0.0 to make it accessible outside the docker container
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Streaming Server running on port ${PORT}`);
    });
})();