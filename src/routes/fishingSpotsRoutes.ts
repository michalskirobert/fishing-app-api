import express from "express";
import {
  getAllFishingSpots,
  createFishingSpot,
  getFishingSpot,
  // updateFishingSpot,
  // deleteFishingSpot,
} from "@controllers/fishingSpotsController";

const router = express.Router();

router.get("/", getAllFishingSpots);
router.get("/:area/:id", getFishingSpot);
router.post("/", createFishingSpot);
// router.put("/:id", updateFishingSpot);
// router.delete("/:id", deleteFishingSpot);

export default router;
