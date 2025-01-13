const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', async (req, res) => {
    let url = req.query.url;
    if (!url) {
        res.status(400).send('URL no válida ' + url);
        return;
    }
    if (url.indexOf('https://www.fira.gob.mx/Nd/xml/podcast.xml') > -1) {
        url = 'https://anchor.fm/s/ffebb324/podcast/rss';
    }


    const host = new URL(url).hostname;
    if (!host.endsWith('fira.gob.mx') && !host.endsWith('archive.org') && !host.endsWith('eleconomista.com.mx') && !host.endsWith('anchor.fm')) {
        console.log('Invalid Host:', host);
        res.status(400).send('URL no válida ' + url);
        return;
    }

    try {
        const response = await axios.get(url, {
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