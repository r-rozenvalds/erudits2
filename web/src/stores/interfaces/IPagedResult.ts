export interface IPagedResult<T> {
  items: T[];
  total_items: number;
  items_per_page: number;
  page: number;
  total_pages: number;
}

export function Empty<T>(): IPagedResult<T> {
  return {
    items: [],
    total_items: 0,
    items_per_page: 0,
    page: 0,
    total_pages: 0,
  };
}
