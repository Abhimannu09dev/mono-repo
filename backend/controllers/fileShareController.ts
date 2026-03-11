import { Request, Response } from "express";
import crypto from "crypto";
import FileShare from "../models/fileShareSchema";
import File from "../models/fileSchema";

export const generateShareLink = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fileId } = req.params;

    // Verify file exists and user is the owner
    const file = await File.findOne({ _id: fileId, userId });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Error processing request",
        error: "File not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    // Replace existing link if one exists (one link per file)
    const share = await FileShare.findOneAndUpdate(
      { fileId },
      { token, createdBy: userId },
      { upsert: true, new: true },
    );

    const shareLink = `${req.protocol}://${req.get("host")}/api/share/${token}`;

    res.status(201).json({
      success: true,
      message: "Share link generated successfully",
      data: { shareLink },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing request",
      error: (error as Error).message,
    });
  }
};

export const viewSharedFile = async (req: Request, res: Response) => {
  try {
    const file = await File.findById(req.fileShare!.fileId);
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Error processing request",
        error: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "File retrieved successfully",
      data: {
        fileName: file.fileName,
        mimeType: file.mimeType,
        path: file.path,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing request",
      error: (error as Error).message,
    });
  }
};

export const revokeShareLink = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { fileId } = req.params;

    // Only owner can revoke
    const file = await File.findOne({ _id: fileId, userId });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "Error processing request",
        error: "File not found",
      });
    }

    await FileShare.findOneAndDelete({ fileId });

    res.status(200).json({
      success: true,
      message: "Share link revoked successfully",
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
