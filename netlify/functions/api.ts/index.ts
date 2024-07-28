import express, { Request, Response } from "express";
import serverless from "serverless-http";
import fishingSpotsRoutes from "./../../../src/routes/fishingSpotsRoutes";
import dictionaryRoutes from "./../../../src//routes/dictionaries";
import authRoutes from "./../../../src//routes/authRoutes";
import { authMiddleware } from "./../../../src/middlewares/authMiddleware";
import cors from "cors";
import env from "./../../../src/config/env";

const app = express();

const allowedOrigins = [
  "*",
  "http://localhost:3000",
  "http://localhost:3000/",
  "https://fishing-managment.netlify.app",
  "https://fishing-managment.netlify.app/",
];

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

app.get("/api/init", (req: Request, res: Response) =>
  res.status(200).json({
    version: env.VERSION_APP,
  })
);

app.use("/api/fishing-spots", authMiddleware, fishingSpotsRoutes);
app.use("/api/dictionaries", authMiddleware, dictionaryRoutes);
app.use("/api/authentication", authRoutes);

const handler = serverless(app);

export { handler };
