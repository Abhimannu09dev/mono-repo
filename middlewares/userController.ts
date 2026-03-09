import { Request, Response } from "express";
import User from "../models/userSchema";
import bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "Request processed successfully",
      data: { newUser },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing request",
      error: error instanceof Error ? error.message : error,
    });
  }
};
