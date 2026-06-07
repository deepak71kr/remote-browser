# Remote Browser Control System

A full-stack application that launches an isolated Dockerized Chromium browser and streams it to a React web interface in real time. Users can remotely interact with the browser through mouse clicks, scrolling, and keyboard input.

## Tech Stack

* **Frontend:** React + Vite
* **Backend:** Node.js + Express
* **Browser Environment:** Docker + Puppeteer
* **Communication:** Socket.IO (WebSockets)

## Prerequisites

* Node.js (v18+)
* Docker Desktop (running)

## Setup

### 1. Build the Browser Container

```bash
cd browser-container
docker build -t remote-browser-image .
```

### 2. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../orchestrator
npm install
```

## Run the Application

### Terminal 1 — Start the Orchestrator

```bash
cd orchestrator
node server.js
```

### Terminal 2 — Start the Frontend

```bash
cd frontend
npm run dev
```

Open the Vite localhost URL in your browser and click **Start Browser**. The orchestrator will launch the Docker container and begin streaming the remote browser session.

## Architecture

```
React Frontend
      │
      ▼
Node.js Orchestrator
      │
      ▼
Docker Container
(Headless Chromium + Puppeteer)
```

Real-time browser streaming and control are handled through WebSockets.
