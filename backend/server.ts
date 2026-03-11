import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
