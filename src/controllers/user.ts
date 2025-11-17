import type { Request, Response } from "express";
import User from "../model/User.js";
import jwt from 'jsonwebtoken'
import TryCatch from "../utils/TryCatch.js";
import type { AuthenticationRequest } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { cloudinary, configureCloudinary } from "../config/cloudinary.js";


export const loginUser = TryCatch(async (req, res) => {
    const { email, name, image } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name,
            email,
            image,
        });
    }

    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
        expiresIn: "5d",
    });

    res.status(200).json({
        message: 'User created successfully',
        token,
        user
    })
});


export const myProfile = TryCatch(async (req: AuthenticationRequest, res) => {
    const user = req.user;

    res.json(user)
});


export const userProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404).json({
            message: 'No user with this id',
        });
        return;
    }

    res.json(user)
});


export const updateUser = TryCatch(async (req: AuthenticationRequest, res) => {
    const { name, instrgram, facebook, linkedin, bio } = req.body;

    const user = await User.findByIdAndUpdate(req.user?._id, {
        name, instrgram, facebook, linkedin, bio,
    }, { new: true });

    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
        expiresIn: "5d",
    });

    res.json({
        messaeg: 'User updated',
        token,
        user,
    })
});


export const updateProfilePicture = TryCatch(async (req: AuthenticationRequest, res: Response) => {
    const file = req.file;


    if (!file) {
        res.status(400).json({
            message: 'No file uploaded'
        });
        return;
    }

    const fileBuffer = getBuffer(file)

    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({
            message: 'Could not process file'
        });
        return;
    }


    // Get the configured cloudinary instance
    const { cloudinary: configuredCloudinary } = configureCloudinary();

    if (!configuredCloudinary.config().api_key) {
        res.status(500).json({
            message: 'Cloudinary is not configured properly'
        });
        return;
    }

    try {
        const cloud = await configuredCloudinary.uploader.upload(fileBuffer.content, {
            folder: 'blogs',
            resource_type: 'auto',
        });

        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                image: cloud.secure_url
            },
            { new: true }
        );

        const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
            expiresIn: "5d",
        });
        // This is a placeholder for the actual implementation
        res.json({
            message: 'Profile picture updated successfully',
            token,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error uploading to Cloudinary',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }


})