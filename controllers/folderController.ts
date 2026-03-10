import { Request, Response } from "express";
import Folder from "../models/folderSchema";

export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const decodedToken = req.user;
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    console.log("Decoded Token:", decodedToken); //
    const userId = decodedToken.id;
    const folder = new Folder({ name, userId });
    await folder.save();
    res.status(201).json({ success: true, folder });
  } catch (error: any) {
    console.error("Error creating folder:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

