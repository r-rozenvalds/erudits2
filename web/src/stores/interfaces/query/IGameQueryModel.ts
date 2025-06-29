import { IBaseQueryModel } from "./IBaseQueryModel";

export interface IGameQueryModel extends IBaseQueryModel {
  id?: string;
  user_id?: string;
  add_rounds?: boolean;
  add_questions?: boolean;
  add_answers?: boolean;
}
