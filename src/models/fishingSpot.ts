import mongoose, { Schema, Document } from "mongoose";

// Define interface for TypeScript type checking
export interface IFishingSpot {
  id: string;
  name: string;
  location: string;
  // Add other fields as per your schema
}

// Define Mongoose schema for FishingSpot
const FishingSpotSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  // Define other fields here
});

// Create and export Mongoose model
export default mongoose.model<IFishingSpot>(
  "FishingSpot",
  FishingSpotSchema,
  "spots"
);
