const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        res.status(400).send('URL no válida');
        return;
    }

    const host = new URL(url).hostname;
    if (!host.endsWith('fira.gob.mx') && !host.endsWith('archive.org') && !host.endsWith('eleconomista.com.mx')) {
        console.log('Invalid Host:', host);
        res.status(400).send('URL no válida');
        return;
    }

    if (url.indexOf('https://www.fira.gob.mx/Nd/xml/podcast.xml') > -1) {
        url = "https://anchor.fm/s/ffebb324/podcast/rss";
    }


    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/xml'
            },
            maxRedirects: 10,
            timeout: 30000
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});