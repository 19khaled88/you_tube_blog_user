import express from 'express';
import dotenv from 'dotenv';
import connectDb from './utils/db.js';
import userRotues from './routes/user.js'

dotenv.config();

const app = express();

app.use(express.json());

connectDb();

app.use('/api/v1',userRotues);

const port = process.env.PORT;


app.listen(5000, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})