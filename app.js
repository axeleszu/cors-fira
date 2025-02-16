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

    const host = new URL(url).hostname;
    if (!host.endsWith('fira.gob.mx') && !host.endsWith('archive.org') && !host.endsWith('eleconomista.com.mx')) {
        console.log('Invalid Host:', host);
        res.status(400).send('URL no válida ' + url);
        return;
    }

    t = new Date().getMilliseconds();
    url += (url.includes('?') ? '&' : '?') + 't=' + t;

    try {
        const response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/xml',
                'User-Agent': 'Mozilla/5.0 (compatible; Node.js proxy)'
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