import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import shortenurl from './router.js';
app.use(bodyParser.json());
const Port=process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.use('/api/shorten',shortenurl);

app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
})