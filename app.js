const express = require('express');
const axios = require('axios');
const cors = require('cors');
const compression = require('compression');
const NodeCache = require('node-cache');
const app = express();
const port = 3000;

const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

app.use(compression());
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

    const cacheKey = url;
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
        console.log('Sirviendo desde caché:', url);

        if (cachedData.contentType) {
            res.setHeader('Content-Type', cachedData.contentType);
        }
        return res.send(cachedData.buffer);
    }

    t = new Date().getMilliseconds();
    url += (url.includes('?') ? '&' : '?') + 't=' + t;

    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Node.js proxy)'
            },
            maxRedirects: 10,
            timeout: 30000
        });

        // Guardar en caché
        myCache.set(cacheKey, {
            buffer: response.data,
            contentType: contentType
        });

        if (response.headers['content-type']) {
            res.setHeader('Content-Type', response.headers['content-type']);
        }

        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error: ' + error);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});