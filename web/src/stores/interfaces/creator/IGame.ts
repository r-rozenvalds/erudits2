import { IUser } from "../IUser";
import { IRound } from "./IRound";

export interface IGame {
  id: string;
  title: string;
  description: string;
  user?: IUser;
  rounds: IRound[];
  last_activation?: string;
  created_at: string;
  updated_at: string;
}
