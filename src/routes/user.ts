import express from 'express'
import { loginUser, myProfile, updateUser, userProfile } from '../controllers/user.js'
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router()



router.post('/login',loginUser);
router.get('/me',isAuth,myProfile);
router.get('/user/:id',userProfile);
router.post('/user/update',isAuth,updateUser)

export default router