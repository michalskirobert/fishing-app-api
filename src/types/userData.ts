export enum ProfileId {
  Admin = 1,
  Moderator = 10,
  Fisherman = 20,
}

export type UserDataProps = {
  email: string;
  permissions: any[];
  password: string;
  permitNo: number | null;
  avatar: string;
  accountCreatedDate: string;
  lastVisitedDate: string;
  accessToken: string | null;
  isLogin: boolean;
  registries: any[];
  profileId: ProfileId;
  pesel: number;
  birthDate: Date;
  showMessage?: boolean;
};
