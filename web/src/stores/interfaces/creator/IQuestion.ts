import { IAnswer } from "./IAnswer";

export interface IQuestion {
  id: string;
  title: string;
  is_text_answer: boolean;
  guidelines: string;
  image_url: string;
  order: number;
  answers: IAnswer[];
  round_id: string;
  created_at: string;
  updated_at: string;
}
