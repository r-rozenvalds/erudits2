import { IUser } from "../IUser";

export interface IUserLoginResponseModel {
  message: string;
  user: IUser;
  token: string;
}
