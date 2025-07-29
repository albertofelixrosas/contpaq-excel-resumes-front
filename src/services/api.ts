import axios from 'axios';

const isDevelopment = import.meta.env.NODE_ENV === 'development';
const apiUrl = isDevelopment ? import.meta.env.VITE_API_URL : 'http://localhost:3000';

export const api = axios.create({
  baseURL: apiUrl,
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
