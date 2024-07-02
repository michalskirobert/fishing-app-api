import express from "express";
import fishingSpotsRoutes from "@routes/fishingSpotsRoutes";
import authRoutes from "@routes/authRoutes";
import { authMiddleware } from "@middlewares/authMiddleware";

import env from "./config/env";

const app = express();
const port = env.PORT || 3000;

app.use(express.json());

app.use("/api/fishing-spots", authMiddleware, fishingSpotsRoutes);
app.use("/api/authentication", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
