export interface BaseResponse {
  meta: MetaResponse;
}

export interface MetaResponse {
  pagination: Pagination;
}

export interface Pagination {
  count: number;
  current_page: number;
  links: string[];
  per_page: number;
  total: number;
  total_pages: number;
}