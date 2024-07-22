export type FishingSpotProps = {
  name: string;
  club: string;
  distrcit: string;
  code: string;
  isNoKill?: boolean;
  geolocation?: {
    lat: number;
    lng: number;
  };
  author?: string;
  addedDate?: string;
  leaseFrom?: string | null;
  leaseUntil?: string | null;
  description: string;
  editedBy?: string;
  editDate?: string;
  isLeaseEnd?: boolean;
};
