import { Request, Response } from "express";
import File from "../models/fileSchema";
import Folder from "../models/folderSchema";
import fs from "fs";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { folderId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Error processing request",
        error: "No file uploaded",
      });
    }

    // Only validate folder if folderId was provided
    if (folderId) {
      const folder = await Folder.findOne({ _id: folderId, userId });
      if (!folder) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({
          success: false,
          message: "Error processing request",
          error: "Folder not found",
        });
      }
    }

    const file = await File.create({
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      path: req.file.path,
      folderId: folderId || undefined,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: { file },
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: "Error processing request",
      error: (error as Error).message,
    });
  }
};

