import express, { Application, Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import folderRoutes from "./routes/folder.routes";
import fileRoutes from "./routes/file.routes";

const app: Application = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

export default app;
