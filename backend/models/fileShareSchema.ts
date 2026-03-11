import { model, Schema, Types } from "mongoose";

export interface IFileShare {
  fileId: Types.ObjectId;
  createdBy: Types.ObjectId;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const fileShareSchema = new Schema<IFileShare>(
  {
    fileId: {
      type: Schema.Types.ObjectId,
      ref: "File",
      required: true,
      unique: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const FileShare = model<IFileShare>("FileShare", fileShareSchema);
export default FileShare;
