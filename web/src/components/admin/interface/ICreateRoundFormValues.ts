export interface ICreateRoundFormValues {
  id: string;
  title: string;
  disqualify_amount: number;
  answer_time: number;
  points: number;
  is_additional: boolean;
  game_id?: string;
}
