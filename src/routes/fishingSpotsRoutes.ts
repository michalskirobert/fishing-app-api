import express from "express";
import * as fishingSpotController from "../controllers/fishingSpotsController";

const router = express.Router();

router.get("/fishing-spots", fishingSpotController.getAllFishingSpots);
router.get("/fishing-spots/:id", fishingSpotController.getFishingSpotById);
router.post("/fishing-spots", fishingSpotController.createFishingSpot);
router.put("/fishing-spots/:id", fishingSpotController.updateFishingSpot);
router.delete("/fishing-spots/:id", fishingSpotController.deleteFishingSpot);

export default router;
