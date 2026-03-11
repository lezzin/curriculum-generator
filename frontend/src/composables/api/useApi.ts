import { api } from '../../services/api/api';
import { createApi } from './createApi';

export function useApi() {
  return createApi(api);
}
