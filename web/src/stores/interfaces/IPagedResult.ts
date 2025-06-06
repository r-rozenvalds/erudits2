export interface IPagedResult<T> {
  items: T[];
  total_items: number;
  items_per_page: number;
  page: number;
  total_pages: number;
}
