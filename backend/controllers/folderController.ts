import { Request, Response } from "express";
import Folder from "../models/folderSchema";

export const  createFolder = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const decodedToken = req.user;
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    console.log("Decoded Token:", decodedToken);
    const userId = decodedToken.id;
    const folder = new Folder({ name, userId });
    await folder.save();
    res.status(201).json({
      success: true,
      message: "Folder created successfully",
      data: { folder },
    });
  } catch (error: any) {
    console.error("Error creating folder:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getFolders = async (req: Request, res: Response) => {
  try {
    const decodedToken = req.user;
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const folder = await Folder.findById(decodedToken.id);
    if (!folder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }
    res.json({
      success: true,
      message: "Folder retrieved successfully",
      data: { folder },
    });
  } catch (error: any) {
    console.error("Error fetching folder:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const decodedToken = req.user;
    if (!decodedToken || !decodedToken.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const folderId = req.params.id;
    const folder = await Folder.findByIdAndDelete({
      _id: folderId,
      userId: decodedToken.id,
    });

    if (!folder) {
      return res
        .status(404)
        .json({ success: false, message: "Folder not found" });
    }

    res.json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
