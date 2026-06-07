const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());

const PORT = 3000;

app.post('/start-browser', (req, res) => {
    console.log("Request received: Spinning up remote browser container...");

    // run detached and auto-remove when done
    const command = 'docker run --rm -d -p 8080:8080 remote-browser-image';

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error starting container: ${error.message}`);
            return res.status(500).json({ error: "Failed to start browser" });
        }
        
        console.log(`Container started successfully! ID: ${stdout.trim()}`);
        
        // give the container a few seconds to boot before notifying frontend
        setTimeout(() => {
            res.json({ message: "Browser started successfully!" });
        }, 3000);
    });
});

app.listen(PORT, () => {
    console.log(`Orchestrator listening on http://localhost:${PORT}`);
});