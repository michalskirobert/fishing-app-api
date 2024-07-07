import express from "express";
import {
  getAllFishingSpots,
  // getFishingSpotById,
  createFishingSpot,
  // updateFishingSpot,
  // deleteFishingSpot,
} from "@controllers/fishingSpotsController";

const router = express.Router();

router.get("/", getAllFishingSpots);
// router.get("/:id", getFishingSpotById);
router.post("/", createFishingSpot);
// router.put("/:id", updateFishingSpot);
// router.delete("/:id", deleteFishingSpot);

export default router;
