import { Request, Response } from "express";
import * as fishingSpotsService from "../services/fishingSpotsService";

export const getFishingSpots = async (
  req: Request,
  res: Response
): Promise<void> => {
  const fishingSpots = await fishingSpotsService.getAllFishingSpots();
  res.status(200).json(fishingSpots);
};

export const getFishingSpotById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const fishingSpot = await fishingSpotsService.getFishingSpotById(id);
  if (fishingSpot) {
    res.status(200).json(fishingSpot);
  } else {
    res.status(404).send("Fishing spot not found");
  }
};

export const createFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const newFishingSpot = req.body;
  const createdFishingSpot = await fishingSpotsService.createFishingSpot(
    newFishingSpot
  );
  res.status(201).json(createdFishingSpot);
};

export const updateFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const updatedFishingSpot = req.body;
  const result = await fishingSpotsService.updateFishingSpot(
    id,
    updatedFishingSpot
  );
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).send("Fishing spot not found");
  }
};

export const deleteFishingSpot = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const result = await fishingSpotsService.deleteFishingSpot(id);
  if (result) {
    res.status(204).send();
  } else {
    res.status(404).send("Fishing spot not found");
  }
};
