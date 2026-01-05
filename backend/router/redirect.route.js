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
      await redisClient.expire(redisKey, 1200); // sliding TTL
      return res.redirect(cachedUrl);
    }

    /* Fallback to PostgreSQL (Neon) */
    const result = await client(
      `SELECT id, original_url
       FROM urls
       WHERE short_code = $1
         AND is_active = TRUE
         AND (expires_at IS NULL OR expires_at > NOW())
       LIMIT 1`,
      [shortId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Short URL not found or expired" });
    }

    const { id, original_url } = result.rows[0];

    /* 3️⃣ Cache in Redis */
    await redisClient.set(redisKey, original_url, { EX: 3600 });

    /* 4️⃣ Increment click count (DB) */
    await client(
      `UPDATE urls
       SET click_count = click_count + 1
       WHERE id = $1`,
      [id]
    );

    res.redirect(original_url);

  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
