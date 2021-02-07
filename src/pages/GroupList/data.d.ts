import type { DataNode } from 'antd/lib/tree';
import type React from '_@types_react@17.0.0@@types/react';

export interface TableListItem {
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
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
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
}

export interface QueryGroupTreeParams {
  level: number,
  key: string,
  isManager?: boolean
}

export interface GroupNode extends DataNode {
  title?: React.ReactNode;
  key: React.ReactText;
  isLeaf?: boolean;
  children?: GroupNode[];
  level?: number,
  manager?: string,
  isManager?: boolean,
}

export interface QueryGroupMemberParams {
  group: string,
  getParent?: boolean,
}

export interface GroupMemberData {
  real_name: string,
  role: string,
  uid: string,
  targetKey?: boolean
}
