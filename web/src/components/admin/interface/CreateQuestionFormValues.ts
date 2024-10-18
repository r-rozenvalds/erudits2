import { AnswerType } from "../../universal/AnswerType";

export interface CreateQuestionFormValues {
  question: string;
  is_open_answer: boolean;
  answers: AnswerType[];
  open_answers: string;
}
