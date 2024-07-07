import express from "express";
import fishingSpotsRoutes from "@routes/fishingSpotsRoutes";
import authRoutes from "@routes/authRoutes";
import { authMiddleware } from "@middlewares/authMiddleware";

import cors from "cors";
import env from "./config/env";

const app = express();
const port = env.PORT;

const allowedOrigins = ["*", "http://localhost:3000", "http://localhost:3000/"];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Błąd CORS"));
    }
  },
};

app.use(express.json());

app.use(cors(corsOptions));

app.use("/api/fishing-spots", authMiddleware, fishingSpotsRoutes);
app.use("/api/authentication", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
