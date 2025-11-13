import express, { type Request, type Response } from 'express'
import { loginUser } from '../controllers/user.js'

const router = express.Router()

router.get('/',(req:Request,res:Response)=>{
    res.status(200).json({
        message:'Server is live successfully',
        data:'',
        success:true
    })
})

router.post('/login',loginUser)
export default router