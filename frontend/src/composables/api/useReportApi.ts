import { reportApi } from '../../services/api/api';
import { createApi } from './createApi';

export function useReportApi() {
  return createApi(reportApi);
}
