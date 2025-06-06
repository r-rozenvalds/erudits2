export interface IBaseQueryModel {
  filter?: string;
  sortBy?: string;
  sortDesc?: boolean;
  page: number;
  limit: number;
}
