import { FishingSpot } from "../models/fishingSpot";

// Dummy data for demonstration purposes
let fishingSpots: FishingSpot[] = [
  { id: "1", name: "Spot 1", location: "Lake 1" },
  { id: "2", name: "Spot 2", location: "River 1" },
];

export const getAllFishingSpots = async (): Promise<FishingSpot[]> => {
  return fishingSpots;
};

export const getFishingSpotById = async (
  id: string
): Promise<FishingSpot | null> => {
  const fishingSpot = fishingSpots.find((spot) => spot.id === id);
  return fishingSpot || null;
};

export const createFishingSpot = async (
  newFishingSpot: FishingSpot
): Promise<FishingSpot> => {
  fishingSpots.push(newFishingSpot);
  return newFishingSpot;
};

export const updateFishingSpot = async (
  id: string,
  updatedFishingSpot: Partial<FishingSpot>
): Promise<FishingSpot | null> => {
  const index = fishingSpots.findIndex((spot) => spot.id === id);
  if (index === -1) {
    return null;
  }
  fishingSpots[index] = { ...fishingSpots[index], ...updatedFishingSpot };
  return fishingSpots[index];
};

export const deleteFishingSpot = async (id: string): Promise<boolean> => {
  const index = fishingSpots.findIndex((spot) => spot.id === id);
  if (index === -1) {
    return false;
  }
  fishingSpots.splice(index, 1);
  return true;
};
