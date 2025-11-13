import type { Request, Response } from "express";
import User from "../model/User.js";
import jwt from 'jsonwebtoken'
import TryCatch from "../utils/TryCatch.js";
import type { AuthenticationRequest } from "../middleware/isAuth.js";


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




export const myProfile = TryCatch(async (req:AuthenticationRequest, res) => {
    const user = req.user;

    res.json(user)
});


export const userProfile = TryCatch(async(req,res)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404).json({
            message:'No user with this id',
        });
        return;
    }

    res.json(user)
});


export const updateUser =TryCatch(async(req:AuthenticationRequest,res)=>{
    const {name,instrgram,facebook,linkedin, bio} = req.body;

    const user = await User.findByIdAndUpdate(req.user?._id,{
        name,instrgram,facebook,linkedin,bio,
    },{new:true});

     const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
        expiresIn: "5d",
    });

    res.json({
        messaeg:'User updated',
        token,
        user,
    })
})