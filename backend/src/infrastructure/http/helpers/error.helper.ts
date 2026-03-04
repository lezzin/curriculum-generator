import { AxiosError } from 'axios';

function handleAxiosResponseError(response: any): string {
  const { data, status, statusText } = response;

  if (data?.message) {
    return Array.isArray(data.message) ? data.message.join(', ') : String(data.message);
  }

  if (typeof data === 'string') {
    return data;
  }

  return `Erro ${status}: ${statusText}`;
}

function handleAxiosError(err: AxiosError): string {
  if (err.response) return handleAxiosResponseError(err.response);
  if (err.request) return 'Nenhuma resposta do servidor. Verifique sua conexão.';
  return err.message || 'Erro inesperado.';
}

export function extractErrorMessage(err: unknown): string {
  if (err instanceof AxiosError) return handleAxiosError(err);
  if (err instanceof Error) return err.message;
  return 'Erro inesperado.';
}
