import request from 'umi-request';
import type { TableListParams } from './data.d';

export async function queryUser(params?: TableListParams) {
  return request('/api/user', {
    params,
  });
}

export async function removeUser(params: { key: number[] }) {
  return request('/api/user', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addUser(params: TableListParams) {
  return request('/api/user', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateUser(params: TableListParams) {
  return request('/api/user', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
