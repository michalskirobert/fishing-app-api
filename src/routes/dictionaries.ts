import express from "express";
import {
  createDistrictsDictionaries,
  createSpotTypeDictionary,
  getDistrictDictionary,
  getDistrictsDictionary,
  getSpotTypesDictionary,
  updateDistrictDictionaries,
  updateSpotTypeDictionary,
  getSpotTypeDictionary,
  getDictionaries,
  getDictionary,
} from "@controllers/dictionariesController";

const router = express.Router();

router.get("/", getDictionaries);
router.get("/:id", getDictionary);

router.get("/districts", getDistrictsDictionary);
router.get("/districts/:id", getDistrictDictionary);
router.put("/districts/:id", updateDistrictDictionaries);
router.post("/districts", createDistrictsDictionaries);

router.get("/spot-types", getSpotTypesDictionary);
router.get("/spot-types/:id", getSpotTypeDictionary);
router.put("/spot-types/:id", updateSpotTypeDictionary);
router.post("/spot-types", createSpotTypeDictionary);

export default router;
