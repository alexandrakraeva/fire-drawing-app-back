﻿const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google Cloud Storage
const storage = new Storage({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON)
});
const bucketName = 'fire-drawing-storage'; // Replace with your actual bucket name
const bucket = storage.bucket(bucketName);

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));
app.use(cors());

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'POST', // Allow only POST requests from this origin
};
app.use(cors(corsOptions));

app.post('/saveDrawing', async (req, res) => {
    const dataURL = req.body.image;
    const base64EncodedImageString = dataURL.split(';base64,').pop();
    const filename = `drawing-${Date.now()}.png`;

    try {
        const file = bucket.file(filename);
        await file.save(Buffer.from(base64EncodedImageString, 'base64'), {
            metadata: { contentType: 'image/png' },
        });
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
        res.send({ message: 'Drawing saved successfully!', filename, publicUrl });
    } catch (error) {
        console.error('Error saving the drawing:', error);
        res.status(500).send('Error saving the drawing.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const initialState = document.querySelector('.initial-state');
        const secondState = document.querySelector('.second-state');

        // Add the fade-out class to trigger the CSS animation
        initialState.classList.add('fade-out');

        // Listen for the end of the fade-out animation
        initialState.addEventListener('animationend', () => {
            // Once the fade-out is complete, change the display properties
            initialState.style.display = 'none';
            secondState.style.display = 'block';
        });
    }, 2000); // Wait 2 seconds before starting the fade-out animation
});

