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

export type DictionaryProps = {
  name: string;
  createdDate: Date | null;
  language: "pl" | "en" | "uk" | "rus";
  isActive: boolean;
};
