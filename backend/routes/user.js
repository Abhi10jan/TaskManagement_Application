const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/sign-in", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save(); // Save user to database

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, "your_secret_key", { expiresIn: "2d" });

        return res.status(201).json({
            message: "Signup successful",
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
            token: token
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});


router.post("/log-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const authClaims = { id: existingUser._id, username: existingUser.username };
        const token = jwt.sign(authClaims, "hello", { expiresIn: "2d" });

        // ✅ Return a structured response
        return res.status(200).json({
            message: "Login successful",
            id: existingUser._id,
            token: token
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
