export interface TableListItem {
  uid: string;
  // disabled?: boolean;
  // href: string;
  // avatar: string;
  realName: string;  //
  // owner: string;
  signature: string;  //
  // callNo: number;  //
  status: string;  //
  loginAt: Date;  //
  createdAt: Date;
  // progress: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  status?: string;
  realName?: string;
  // desc?: string;
  uid?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}
