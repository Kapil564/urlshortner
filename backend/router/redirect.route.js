import express from 'express';
import client from '../utils/client.js';
const router = express.Router();

router.get('/:shortId', async (req, res) => {
    try{
        const shortId = req.params.shortId;
        const result = await client.query(
            'SELECT original_url FROM urls WHERE short_code = $1 LIMIT 1',
            [shortId]
        );
        if(result.rowCount<1) {
            return res.status(404).json({ error: 'Short URL not found' });
        }
        res.redirect(result.rows[0].original_url);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

export default router;

