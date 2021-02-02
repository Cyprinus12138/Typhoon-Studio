import request from 'umi-request';
import type { TableListParams } from './data.d';

export async function queryUser(params?: TableListParams) {
  return request('/api/user', {
    params,
  });
}

export async function removeUser(params: { uid: string[] }) {
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

export async function freezeUser(params: { uid: string[] }) {
  return request('/api/user/freeze', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function unfreezeUser(params: { uid: string[] }) {
  return request('/api/user/freeze', {
    method: 'POST',
    data: {
      ...params,
      status: 1,
    },
  });
}
