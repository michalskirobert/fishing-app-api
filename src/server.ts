import express from "express";
import fishingSpotsRoutes from "./routes/fishingSpotsRoutes";

import { MongoClient, ServerApiVersion } from "mongodb";

import dotenv from "dotenv";
import { connectDatabase } from "./config/database";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDatabase();

app.use(express.json());

app.use("/api/fishing-spots", fishingSpotsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
