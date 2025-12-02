import dotenv from 'dotenv'
import {google} from 'googleapis'


dotenv.config()


const GOOGLE_CLIENT_ID = process.env.Google_Client_id;
const GOOGLE_CLIENT_SECRET =process.env.Google_Client_S_Code;


export const oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    // "postmessage"
    process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3005/api/auth/callback/google'
      : 'https://you-tube-blog-web.vercel.app/api/auth/callback/google'
    // 'http://localhost:3005/api/auth/callback/google'
    // 'https://you-tube-blog-web.vercel.app'

);