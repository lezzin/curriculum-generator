import { storeToRefs } from 'pinia';
import { useReportApi } from './api/useReportApi';
import { useToast } from './useToast';
import { useAuthStore } from '../stores/auth';
import type { ApiRequestParams } from '../interfaces/api.interfaces';

export function useReportRequest(endpoint: string) {
  const { request, loading } = useReportApi();
  const { show } = useToast();
  const { user } = storeToRefs(useAuthStore());

  async function submit(payload: ApiRequestParams) {
    const { error } = await request('post', endpoint, {
      user_uuid: user.value?.id,
      ...payload,
    });


    if (!error) {
      return true;
    }

    show({
      message: error,
      type: 'error',
    });

    return false;
  }

  return {
    submit,
    loading,
  };
}
