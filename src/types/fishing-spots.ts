import { ObjectId } from "mongodb";

export type FishingSpotProps = {
  name: string;
  area: string;
  isNoKill: boolean;
  geolocation?: {
    latitude: string;
    longitude: string;
  };
  author: string;
  addedDate: string;
  leaseUntil: string;
  isPossibleLeaseEnd: boolean;
  code: string;
};
