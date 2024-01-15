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
const bucket = storage.bucket('fire-drawing-storage');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));
app.use(cors());

app.post('/saveDrawing', async (req, res) => {
    const dataURL = req.body.image;
    const base64EncodedImageString = dataURL.split(';base64,').pop();
    const filename = `drawing-${Date.now()}.png`;

    try {
        const file = bucket.file(filename);
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


const corsOptions = {
    origin: 'https://superficial-awesome-ferry.glitch.me', // Replace with your Glitch app's URL
    methods: 'POST', // Allow only POST requests from this origin
};
app.use(cors(corsOptions));}
