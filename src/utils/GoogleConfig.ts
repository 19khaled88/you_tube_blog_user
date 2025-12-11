import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";


dotenv.config();

const GOOGLE_CLIENT_ID = process.env.Google_Client_id as string;
const GOOGLE_CLIENT_SECRET = process.env.Google_Client_S_Code as string;


export const oauth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "postmessage"
)