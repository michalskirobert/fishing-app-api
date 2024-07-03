import express from "express";
import fishingSpotsRoutes from "@routes/fishingSpotsRoutes";
import authRoutes from "@routes/authRoutes";
import { authMiddleware } from "@middlewares/authMiddleware";

import cors from "cors";
import env from "./config/env";

const app = express();
const port = env.PORT;

app.use(express.json());

app.use(cors());

app.use("/api/fishing-spots", authMiddleware, fishingSpotsRoutes);
app.use("/api/authentication", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
