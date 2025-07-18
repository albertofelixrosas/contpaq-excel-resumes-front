import axios from 'axios';
import type { ApiResource } from '../enums/ApiResources';
import type { ApiResourceMap } from '../types/api-resources';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 6000, // opcional: tiempo máximo para la petición
});

export async function getResource<K extends ApiResource>(
  resource: K,
  params: Record<string, any> = {},
): Promise<ApiResourceMap[K]> {
  try {
    const { data } = await api.get<ApiResourceMap[K]>(`/${resource}`, { params });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error fetching ${resource}`);
  }
}

// TODO
// Conectar el backend para recibir parametros
// https://chatgpt.com/share/68776d47-f50c-8013-adc1-265185bdaca4

/*
function handleApiError(error: unknown, resource: string) {
  if (axios.isAxiosError(error)) {
    // error.response -> respuesta del backend
    // error.request  -> no hubo respuesta
    // error.message  -> mensaje general
    if (error.response) {
      console.error(
        `Error [${error.response.status}] al obtener ${resource}:`,
        error.response.data,
      );
      throw new Error(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error(`No hubo respuesta al obtener ${resource}:`, error.request);
      throw new Error(`No hubo respuesta del servidor al obtener ${resource}`);
    } else {
      console.error(`Error desconocido al obtener ${resource}:`, error.message);
      throw new Error(error.message);
    }
  } else {
    console.error(`Error inesperado al obtener ${resource}:`, error);
    throw new Error(`Error inesperado: ${error}`);
  }
}
*/
