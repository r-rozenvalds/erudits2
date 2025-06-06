export interface IPlayer {
  id: string;
  player_name: string;
  is_disqualified: boolean;
  is_ready: boolean;
  is_tiebreaking: boolean;
  current_question: number;
  points: number;
  buzzer_enabled: boolean;
  position?: number;
}
