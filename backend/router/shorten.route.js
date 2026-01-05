import express from 'express';
import client from '../utils/client.js';
const router = express.Router();
import generateCode from '../utils/generateCode.js';
import redisClient from '../config/redis.js';

router.post('/shorten', async (req, res) => {
    try{
        const url=req.body.originalUrl;
        if(!url){
            return res.status(400).json({ error: 'URL is required' });
        }
        const existing = await client.query(
            `SELECT short_code
            FROM urls
            WHERE original_url = $1
            LIMIT 1`,
            [url]
        );

        if (existing.rows.length > 0) {
        return res.json({ code: existing.rows[0].short_code });
        }

        let code;
        let exists;
        
        do {
        code = generateCode(6);
        exists = await client.query(
            'SELECT 1 FROM urls WHERE short_code = $1 LIMIT 1',
            [code]
        );
        } while (exists.rowCount > 0);


        let myquery="INSERT INTO urls (original_url, short_code) VALUES ($1, $2);"
        await client.query(myquery, [url, code]);
        await redisClient.set(
        `short:${code}`,
        url,
        { EX: 3600 }
        );
        res.json({code});

    }catch(error){
        console.error( error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;
