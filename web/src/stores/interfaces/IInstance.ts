import { IQuestion } from "../../components/admin/interface/IQuestion";
import { IRound } from "../../components/admin/interface/IRound";

interface IAnswer {
  id: string;
  text?: string;
  question_id: string;
}

export interface IInstance {
  questions: IQuestion[];
  round?: IRound;
  answers: IAnswer[];

  id: string;
  countdownTime: string;
  isBuzzerMode: boolean;
}
