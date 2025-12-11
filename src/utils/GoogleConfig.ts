import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { Auth, google } from "googleapis";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.Google_Client_id as string;
const GOOGLE_CLIENT_SECRET = process.env.Google_Client_S_Code as string;

export const createOAuth2Client = (redirectUri: string): Auth.OAuth2Client => {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    redirectUri
  );
};

export const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  // "postmessage"
  process.env.NODE_ENV === "development"
    ? "http://localhost:3005/api/auth/callback/google"
    : "https://you-tube-blog-web.vercel.app/api/auth/callback/google"
  // 'http://localhost:3005/api/auth/callback/google'
  // 'https://you-tube-blog-web.vercel.app'
);



export const oauth2Client = new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "postmessage"
    // process.env.NODE_ENV === "development"
    // ? "http://localhost:3005/api/auth/callback/google"
    // : "https://you-tube-blog-web.vercel.app/api/auth/callback/google"

)