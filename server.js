const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// File path for the JSON file where we store the username
const dataFilePath = path.join(__dirname, 'data.json');

// POST API to save username to the file
app.post('/saveUsername', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Save the username to the JSON file
    fs.writeFile(dataFilePath, JSON.stringify({ username }), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save username' });
        }

        res.status(200).json({ message: 'Username saved successfully' });
    });
});

// GET API to retrieve the saved username
app.get('/getUsername', (req, res) => {
    // Check if the file exists
    if (!fs.existsSync(dataFilePath)) {
        return res.status(404).json({ error: 'No username saved' });
    }

    // Read the file and send back the username
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read username' });
        }

        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});