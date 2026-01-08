import shortenurl from "./router/shorten.route.js";
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import redirecturl from "./router/redirect.route.js";
const Port=process.env.PORT || 5000;
const allowedOrigin = 'https://urlshortner-seven-olive.vercel.app/';
const localhostOrigin = 'http://localhost:5173';
import rateLimit from "./middleware/rateLimit.js"
const app = express();
dotenv.config();

// allowing cors 
app.use(cors({
    origin: [allowedOrigin, localhostOrigin],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Anon-Id']
}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.post('/shorten', rateLimit, shortenurl);
app.get('/:code', redirecturl)
app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})