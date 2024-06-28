import FishingSpot, { IFishingSpot } from "../models/FishingSpot";

export const getAllFishingSpots = async (): Promise<IFishingSpot[]> => {
  try {
    return await FishingSpot.find();
  } catch (error) {
    throw new Error("Error fetching fishing spots");
  }
};

export const getFishingSpotById = async (
  id: string
): Promise<IFishingSpot | null> => {
  try {
    return await FishingSpot.findById(id);
  } catch (error) {
    throw new Error("Error fetching fishing spot");
  }
};

export const createFishingSpot = async (
  name: string,
  location: string
): Promise<IFishingSpot> => {
  try {
    const newSpot = new FishingSpot({ name, location });
    return await newSpot.save();
  } catch (error) {
    throw new Error("Error creating fishing spot");
  }
};

export const updateFishingSpot = async (
  id: string,
  name: string,
  location: string
): Promise<IFishingSpot | null> => {
  try {
    const updatedSpot = await FishingSpot.findByIdAndUpdate(
      id,
      { name, location },
      { new: true }
    );
    return updatedSpot;
  } catch (error) {
    throw new Error("Error updating fishing spot");
  }
};

export const deleteFishingSpot = async (id: string): Promise<void> => {
  try {
    await FishingSpot.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("Error deleting fishing spot");
  }
};
