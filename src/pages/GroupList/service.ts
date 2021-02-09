import request from 'umi-request';
import type {
  TableListParams,
  QueryGroupTreeParams,
  QueryGroupMemberParams,
  CreateGroupParams,
  PutMemberGroupParams,
} from './data.d';

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

export async function createGroup(params: CreateGroupParams) {
  return request('/api/group', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function putGroupMember(params: PutMemberGroupParams) {
  return request('/api/group/members', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
