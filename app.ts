import express, { Application, Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import folderRoutes from "./routes/folder.routes";

const app: Application = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

export default app;
