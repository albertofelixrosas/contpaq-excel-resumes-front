import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 30000,
});

export const getResource = <T>(resource: string, params = {}) =>
  api.get<T>(resource, { params }).then(res => res.data);

export const postResource = <T>(resource: string, body: any) =>
  api.post<T>(resource, body).then(res => res.data);

export const putResource = <T>(resource: string, body: any) =>
  api.put<T>(resource, body).then(res => res.data);

export const patchResource = <T>(resource: string, body: any) =>
  api.patch<T>(resource, body).then(res => res.data);

export const deleteResource = <T>(resource: string, params = {}) =>
  api.delete<T>(resource, { params }).then(res => res.data);
