import express from 'express'
import { loginUser, myProfile, updateProfilePicture, updateUser, userProfile } from '../controllers/user.js'
import { isAuth } from '../middleware/isAuth.js';
import upload from '../middleware/multer.js';

const router = express.Router()



router.post('/login',loginUser);
router.get('/me',isAuth,myProfile);
router.get('/user/:id',userProfile);
router.post('/user/update',isAuth,updateUser);
router.post('/user/update/profile-picture',isAuth,upload,updateProfilePicture);

export default router