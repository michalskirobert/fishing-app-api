import express from "express";
import {
  getDistrictsDictionaryController,
  getSpotTypesDictionaryController,
} from "@controllers/dictionariesController";

const router = express.Router();

router.get("/districts", getDistrictsDictionaryController);

router.get("/spot-types", getSpotTypesDictionaryController);

export default router;
