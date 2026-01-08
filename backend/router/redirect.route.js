import express from "express";
import client from "../utils/client.js";
import redisClient from "../config/redis.js";
const router = express.Router();




router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  
  try {
    const redisKey = `short:${shortId}`;
    const cachedUrl = await redisClient.get(redisKey);

    if (cachedUrl) {
      res.redirect(cachedUrl);
      redisClient.incr(`clicks:${shortId}`).catch(() => {});
      redisClient.set(redisKey, cachedUrl, { EX: 3600 }).catch(() => {});
      return;
    }

    const result = await client.query(
      `SELECT original_url,expires_at
       FROM urls
       WHERE short_code = $1
         AND is_active = TRUE
       LIMIT 1`,
      [shortId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Short URL not found or expired" });
    }
    if(result.rows[0].expires_at < Date.now()){
      return res.status(404).json({ error: "Short URL has expired" });
    }
    const { original_url } = result.rows[0];
    res.redirect(original_url);
    redisClient.set(redisKey, original_url, { EX: 3600 });

  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
