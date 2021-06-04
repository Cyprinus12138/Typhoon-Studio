export type TableListItem = {
  key: number;
  href: string;
  avatar: string;
  name: string;
  lat: number;
  lon: number;
  intensity: number;
  grade: number;
  img: string;
  code: number;
  status: number;
  createdAt: Date;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
