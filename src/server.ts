import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import connectDb from './utils/db.js';
import userRotues from './routes/user.js'

dotenv.config();

const app = express();

app.use(express.json());

connectDb();

app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({
        message:'Blog - User service is running successfully',
        data:'',
        success:true
    })
});

app.use('/api/v1',userRotues);

const port = process.env.PORT;


app.listen(5000, ()=>{
    console.log(`Server running on http://localhost:${port}`)
})