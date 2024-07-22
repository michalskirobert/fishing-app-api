import express from "express";
import { getSpotsDictionaryController } from "@controllers/dictionariesController";

const router = express.Router();

router.get("/districts", getSpotsDictionaryController);

export default router;
