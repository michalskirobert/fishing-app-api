export type ClubProps = {
  name: string;
  districtName: string;
};

export type DistrictProps = {
  name: string;
  keyName: string;
  clubs: ClubProps[];
};

export type SpotTypeProps = {
  name: string;
};
