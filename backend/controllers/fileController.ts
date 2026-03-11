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
        error: "No file uploaded or file type not allowed",
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

export const getMyFiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { folderId } = req.query;

    // Build query dynamically — filter by folder only if provided
    const query: any = { userId };
    if (folderId) query.folderId = folderId;

    const files = await File.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Files retrieved successfully",
      data: { files },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing request",
      error: (error as Error).message,
    });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fileId } = req.params;

    const file = await File.findOneAndDelete({ _id: fileId, userId });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Error processing request",
        error: "File not found",
      });
    }

    // Delete the actual file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing request",
      error: (error as Error).message,
    });
  }
};
