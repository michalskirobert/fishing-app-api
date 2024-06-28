import { Router } from "express";
import {
  getFishingSpots,
  getFishingSpotById,
  createFishingSpot,
  updateFishingSpot,
  deleteFishingSpot,
} from "../controllers/fishingSpotsController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router: Router = Router();

router.get("/", authMiddleware, getFishingSpots);
router.get("/:id", authMiddleware, getFishingSpotById);
router.post("/", authMiddleware, createFishingSpot);
router.put("/:id", authMiddleware, updateFishingSpot);
router.delete("/:id", authMiddleware, deleteFishingSpot);

export default router;
