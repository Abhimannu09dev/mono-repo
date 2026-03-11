import { model, Schema, Types } from "mongoose";

interface IFile {
  fileName: string;
  mimeType: string;
  path: string;
  folderId?: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    path: { type: String, required: true },
    folderId: { type: Schema.Types.ObjectId, ref: "Folder" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const File = model<IFile>("File", fileSchema);
export default File;
