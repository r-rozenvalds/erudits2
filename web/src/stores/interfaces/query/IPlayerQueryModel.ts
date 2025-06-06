import { IBaseQueryModel } from "./IBaseQueryModel";

export interface IPlayerQueryModel extends IBaseQueryModel {
  id?: string;
  instance_id?: string;
}
