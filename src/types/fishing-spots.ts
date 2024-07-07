export type FishingSpotProps = {
  id: `${number}.${number}` | `.${number}`;
  name: string;
  area: string;
  isNoKill: boolean;
  geolocation: {
    latitude: string;
    longitude: string;
  };
  author: string;
  addedDate: string;
  leaseUntil: string;
  isPossibleLeaseEnd: boolean;
};

export type ParsedFishingSpotsProps = {
  [x: string]: FishingSpotProps[];
};
