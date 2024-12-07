import { AnswerType } from "../../universal/AnswerType";

export interface ICreateQuestionFormValues {
  id: string;
  title: string;
  is_open_answer: boolean;
  answers: AnswerType[];
  open_answers: string;
  round_id: string;
}
