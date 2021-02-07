import request from 'umi-request';
import type { TableListParams, QueryGroupTreeParams, QueryGroupMemberParams } from './data.d';

export async function queryGroup(params?: TableListParams) {
  return request('/api/rule', {
    params,
  });
}

export async function removeGroup(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addGroup(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateGroup(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}

export async function queryGroupTree(params?: QueryGroupTreeParams) {
  return request('/api/group/tree', {
    params,
  });
}

export async function queryGroupMember(params: QueryGroupMemberParams) {
  return request('/api/group/members', {
    params,
  });
}
