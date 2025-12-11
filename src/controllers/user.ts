import type { Request, Response } from "express";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import TryCatch from "../utils/TryCatch.js";
import type { AuthenticationRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { cloudinary, configureCloudinary } from "../config/cloudinary.js";
import { createOAuth2Client, oauth2Client, oauth2client } from "../utils/GoogleConfig.js";
import axios, { isAxiosError } from "axios";

// Define proper error types
interface GoogleTokenError {
  error: string;
  error_description: string;
}

interface GoogleOAuthError extends Error {
  response?: {
    data: GoogleTokenError;
    status: number;
    statusText: string;
  };
}

export const loginUser = TryCatch(async (req, res) => {
  const { code, redirect_uri } = req.body;

  if (!code) {
    res.status(400).json({
      message: "Authorization code is required",
    });
    return;
  }

  // if (code) {
  //   if (!redirect_uri) {
  //     return res.status(400).json({
  //       message: "Redirect URI is required for Google OAuth",
  //     });
  //   }
  // }

  // create OAuth2 client with the redirect url from frontend
  // const oauth2Client = createOAuth2Client(redirect_uri);

  try {
    const {tokens} = await oauth2Client.getToken({
      code,
      // redirect_uri
    });

    oauth2Client.setCredentials(tokens);

    const userinfo = await axios.get(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      }
    );


    // const googleRes = await oauth2client.getToken(code);

    // oauth2client.setCredentials(googleRes.tokens);
    // const userRes = await axios.get(
    //   `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    // );

    const { email, name, picture } = userinfo.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    }

    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
      expiresIn: "5d",
    });

    res.status(200).json({
      message: "User created successfully",
      token,
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      const err = error as GoogleOAuthError;
      console.error("Google OAuth error details:", error);

      //   return res.status(400).json({
      //     message: "Google authentication failed",
      //     error: error.messaeg,
      //     details: error?.response?.data,
      //   });

      const errorMessage = err.response?.data?.error || err.message;
      const errorDescription = err.response?.data?.error_description || "";

      return res.status(400).json({
        message: "Google authentication failed",
        error: errorMessage,
        description: errorDescription,
        details: err.response?.data,
        statusCode: err.response?.status,
        possibleSolutions: [
          "Check if redirect_uri matches Google Cloud Console",
          "Verify the authorization code is valid and not expired",
          "Ensure client ID and secret are correct",
        ],
      });
    }

    // if (error instanceof Error) {
    //   return res.status(500).json({
    //     message: 'Internal server error',
    //     error: error.message
    //   });
    // }
  }
});

export const myProfile = TryCatch(async (req: AuthenticationRequest, res) => {
  const user = req.user;

  res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({
      message: "No user with this id",
    });
    return;
  }

  res.json(user);
});

export const updateUser = TryCatch(async (req: AuthenticationRequest, res) => {
  const { name, instrgram, facebook, linkedin, bio } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      name,
      instrgram,
      facebook,
      linkedin,
      bio,
    },
    { new: true }
  );

  const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
    expiresIn: "5d",
  });

  res.json({
    messaeg: "User updated",
    token,
    user,
  });
});

export const updateProfilePicture = TryCatch(
  async (req: AuthenticationRequest, res: Response) => {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        message: "No file uploaded",
      });
      return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      res.status(400).json({
        message: "Could not process file",
      });
      return;
    }

    // Get the configured cloudinary instance
    const { cloudinary: configuredCloudinary } = configureCloudinary();

    if (!configuredCloudinary.config().api_key) {
      res.status(500).json({
        message: "Cloudinary is not configured properly",
      });
      return;
    }

    try {
      const cloud = await configuredCloudinary.uploader.upload(
        fileBuffer.content,
        {
          folder: "blogs",
          resource_type: "auto",
        }
      );

      const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
          image: cloud.secure_url,
        },
        { new: true }
      );

      const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
        expiresIn: "5d",
      });
      // This is a placeholder for the actual implementation
      res.json({
        message: "Profile picture updated successfully",
        token,
        user,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error uploading to Cloudinary",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
