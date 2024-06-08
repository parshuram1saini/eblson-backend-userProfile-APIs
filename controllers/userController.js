import express from "express";
import asyncHandler from "express-async-handler";
import User from "../model/user.js";
import { generateToken } from "../middleware/auth.js";

export const userRegister = async (req, res) => {
    try {
        const data = req.body;

        if (data && data.email) {
            const checkValidEmail = /\S+@\S+\.\S+/
            if (!checkValidEmail.test(data.email)) return res.status(400).json({ message: "Invalid email format" });
        }

        const userExisted = await User.findOne({ email: data.email });
        if (userExisted) {
            return res.status(400).json({ message: "User email id already exists" });
        }

        const newData = new User(data);

        const response = await newData.save();

        const payload = {
            id: response.id,
        };

        const token = generateToken(payload);
        res.status(201).json({ response, token });
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: "Required field is invalid", error: error.message });
    }
};

export const userLogin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const userData = await User.findOne({ email: email });

        if (!userData || !(await userData.comparePassword(password)))
            return res.status(401).json({ message: "Invalid email or password" })

        const payload = {
            id: userData.id,
        }

        const token = generateToken(payload)

        res.status(200).json({ user: userData, token });
    } catch (error) {
        res.status(500).json({ message: 'SignIn failed', error: error.message });
    }
}

export const getUserProfile = async (req, res) => {
    try {

        const userData = req.user
        const userId = userData.id;
        const user = await User.findById(userId)

        res.status(200).json({ user })

    } catch (error) {
        console.log("err", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const userProfilePhoto = asyncHandler(async (req, res) => {
    try {

        const imageUrl = `/${req.file.path}`;
        const userId = req?.body?.userId;
        const userData = await User.findByIdAndUpdate(userId, { profile_photo: imageUrl }, { new: true });

        if (!userData) return res.status(404).json({ message: "User id not found" });

        res.status(200).json({ message: "Image uploaded Successfully" });
    } catch (error) {
        console.log("error", error);
    }
});
