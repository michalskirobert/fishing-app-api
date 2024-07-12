import express from "express";
import {
  getAllFishingSpots,
  createFishingSpot,
  getFishingSpot,
  updateFishingSpot,
  deleteFishingSpot,
  // updateFishingSpot,
  // deleteFishingSpot,
} from "@controllers/fishingSpotsController";

const router = express.Router();

router.get("/", getAllFishingSpots);
router.post("/", createFishingSpot);
router.get("/:area/:id", getFishingSpot);
router.put("/:area/:id", updateFishingSpot);
router.delete("/:area/:id", deleteFishingSpot);

export default router;
