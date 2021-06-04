import { request } from 'umi';
import type { TableListParams, TableListItem } from './data.d';

export async function queryRule(params?: TableListParams) {
  return request('/api/dataset', {
    params,
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/dataset', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListItem) {
  return request('/api/dataset', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/dataset', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
