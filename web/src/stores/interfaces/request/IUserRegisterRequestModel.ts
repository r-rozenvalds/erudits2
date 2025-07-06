import { IUserLoginRequestModel } from "./IUserLoginRequestModel copy";

export interface IUserRegisterRequestModel extends IUserLoginRequestModel {
  password_confirmation: string;
}
