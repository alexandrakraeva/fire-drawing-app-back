const express = require('express');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const app = express();

const PORT = 3000; // Define port 3000

const storage = new Storage({ keyFilename: 'fifth-being-411122-0a641135f930.json' });
const bucket = storage.bucket('fire-drawing-storage');

app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

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
