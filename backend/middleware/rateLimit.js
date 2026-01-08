import redisClient from '../config/redis.js';

async function rateLimit(req, res, next) {
    const RATE_LIMIT = 100; // max requests per min
    const WINDOW_SIZE_IN_MINUTES = 1;
    try{
        const ip=req.ip;
        const key=`rate-limit:short:${ip}`;
        const count=await redisClient.incr(key);
        if(count===1){
            await redisClient.expire(key, WINDOW_SIZE_IN_MINUTES);
        }
        if(count>RATE_LIMIT){
            console.log(`Rate limit exceeded for IP: ${ip}`);
            return res.status(429).json({ error: "Too Many Requests,Try again after some time" });
        }
        next();
    }catch(error){
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export default rateLimit;