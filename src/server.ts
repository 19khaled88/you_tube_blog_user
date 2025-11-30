import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './utils/db.js';
import userRotues from './routes/user.js'

dotenv.config();

const app = express();

const allowedOrigins = [
    "http://localhost:3005",
    "https://you-tube-blog-web.vercel.app"
]

app.use(cors({
    origin: (origin,callback)=>{
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




connectDb();

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Blog User service is running successfully',
        data: '',
        success: true
    })
});

app.use('/api/v1', userRotues);

const port = process.env.PORT;


app.listen(5000, () => {
    console.log(`Server running on http://localhost:${port}`)
})