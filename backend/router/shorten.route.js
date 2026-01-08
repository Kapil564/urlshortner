import express from "express";
import client from "../utils/client.js";
const router = express.Router();
import generateCode from "../utils/generateCode.js";
import redisClient from "../config/redis.js";

router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    /* validating url format */
    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }
    
    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // checking if url is already shortened
    const existing = await client.query(
      `SELECT short_code,expiry_date
            FROM urls
            WHERE original_url = $1
            LIMIT 1`,
      [originalUrl]
    );

    if (existing.rows.length > 0 && existing.rows[0].expiry_date >Date.now()) {
      return res.json({ code: existing.rows[0].short_code });
    }

    let code;
    while (true) {
      code = generateCode(6);

      try {
        await client.query(
          `INSERT INTO urls (original_url, short_code,expires_at)
           VALUES ($1, $2,$3)`,
          [originalUrl, code,Date.now()]
        );
        break; // success
      } catch (err) {
        if (err.code !== "23505") {
          throw err;
        }
        // else retry with new code
      }
    }
    redisClient.set(`short:${code}`, originalUrl, { EX: 3600 }).catch(() => {console.log("Redis error....")}); // Redis must NOT break API
    res.json({ code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
