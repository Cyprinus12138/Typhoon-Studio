import request from 'umi-request';
import type { CurrentUser } from './data';

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province: string) {
  return request(`/api/geographic/city/${province}`);
}

export async function query() {
  return request('/api/users');
}

export async function submitUpdate(data: CurrentUser) {
  return request('/api/currentUser', {
    method: 'put',
    data,
  });
}
