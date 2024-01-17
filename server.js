const http = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS options
const corsOptions = {
    origin: 'https://superficial-awesome-ferry.glitch.me', // Replace with your front-end URL
    methods: 'POST', // Allow only POST requests from this origin
};

// Apply CORS with the specified options
app.use(cors(corsOptions));

// Body parser middleware to handle JSON data
app.use(bodyParser.json({ limit: '10mb' }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Initialize Google Cloud Storage
const keyFilename = 'fifth-being-411122-73c1efffad5b.json'; // Replace with the actual path
const storage = new Storage({ keyFilename });

const bucketName = 'fire-drawing-storage'; // Replace with your bucket name

app.post('/saveDrawing', async (req, res) => {
    const dataURL = req.body.image;
    const base64EncodedImageString = dataURL.split(';base64,').pop();
    const filename = `drawing-${Date.now()}.png`;

    try {
        // Create a file in the Google Cloud Storage bucket
        const file = storage.bucket(bucketName).file(filename);

        // Upload the image data
        await file.save(Buffer.from(base64EncodedImageString, 'base64'), {
            metadata: { contentType: 'image/png' },
        });

        res.send({ message: 'Drawing saved successfully!', filename });
    } catch (error) {
        console.error('Error saving the drawing:', error);
        res.status(500).send('Error saving the drawing.');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
