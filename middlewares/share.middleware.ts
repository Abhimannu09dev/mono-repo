import { NextFunction, Request, Response } from "express";
import FileShare from "../models/fileShareSchema";

declare global {
  namespace Express {
    interface Request {
      fileShare?: {
        fileId: string;
      };
    }
  }
}

export const validateShareToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.params;

  const share = await FileShare.findOne({ token });

  if (!share) {
    return res.status(404).json({
      success: false,
      message: "Error processing request",
      error: "Invalid share link",
    });
  }

  req.fileShare = { fileId: share.fileId.toString() };
  next();
};
