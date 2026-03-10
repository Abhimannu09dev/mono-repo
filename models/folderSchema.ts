import { model, Schema } from "mongoose";

interface IFolder {
  name: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Folder = model<IFolder>("Folder", folderSchema);
export default Folder;
