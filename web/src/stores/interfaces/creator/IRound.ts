import { IQuestion } from "./IQuestion";

export interface IRound {
  id: string;
  title: string;
  disqualify_amount: number;
  answer_time: number;
  points: number;
  game_id: string;
  is_additional: boolean;
  questions?: IQuestion[];
  order: number;
  is_test: boolean;
  created_at?: string;
  updated_at?: string;
}
