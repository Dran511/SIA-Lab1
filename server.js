const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const PORT = 3000;
const PYTHON_URL = 'http://localhost:5001';

// Request logging
app.use((req, res, next) => {
    console.log(
        `${new Date().toLocaleTimeString()} ${req.method} ${req.url}`
    );

    next();
});

// Serve the calculator UI
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Hello endpoint
app.get('/hello', (req, res) => {
    res.json({
        message: 'Hello from Node.js Gateway!'
    });
});

// Calculation endpoint
app.post('/api/calculate', async (req, res) => {
    try {
        const pythonResponse = await axios.post(
            `${PYTHON_URL}/calculate`,
            req.body
        );

        res.json({
            gateway_message: 'Node.js successfully aggregated the data!',
            python_result: pythonResponse.data
        });

    } catch (error) {
        console.error(
            'Error communicating with Python:',
            error.message
        );

        res.status(500).json({
            error: 'Failed to communicate with Python service'
        });
    }
});

// Service status endpoint
app.get('/api/status', async (req, res) => {
    try {
        const pythonResponse = await axios.get(
            `${PYTHON_URL}/ping`
        );

        res.json({
            node_status: 'Node.js is running!',
            python_status: pythonResponse.data
        });

    } catch (error) {
        console.error(
            'Error checking Python service:',
            error.message
        );

        res.status(500).json({
            error: 'Python service is unavailable'
        });
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(
        `Node.js Gateway: http://localhost:${PORT}`
    );

    console.log(
        `Python URL: ${PYTHON_URL}`
    );

    console.log(
        `Network access enabled on port ${PORT}`
    );
});