import { Request, Response } from "express";
import * as fishingSpotService from "../services/fishingSpotsService";

export const getAllFishingSpots = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const spots = await fishingSpotService.getAllFishingSpots();
    res.json(spots);
  } catch (error) {
    console.error("Error fetching fishing spots:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getFishingSpotById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const spot = await fishingSpotService.getFishingSpotById(id);
    if (!spot) {
      res.status(404).json({ message: "Fishing spot not found" });
      return;
    }
    res.json(spot);
  } catch (error) {
    console.error("Error fetching fishing spot:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, location } = req.body;

  try {
    const newSpot = await fishingSpotService.createFishingSpot(name, location);
    res.status(201).json(newSpot);
  } catch (error) {
    console.error("Error creating fishing spot:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, location } = req.body;

  try {
    const updatedSpot = await fishingSpotService.updateFishingSpot(
      id,
      name,
      location
    );
    if (!updatedSpot) {
      res.status(404).json({ message: "Fishing spot not found" });
      return;
    }
    res.json(updatedSpot);
  } catch (error) {
    console.error("Error updating fishing spot:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    await fishingSpotService.deleteFishingSpot(id);
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting fishing spot:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
