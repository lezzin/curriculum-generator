import { AxiosError, AxiosResponse, isAxiosError } from 'axios';

interface ExtractedAxiosError {
  message: string;
  status: number;
}

function normalizeMessage(message: unknown): string {
  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (typeof message === 'string') {
    return message;
  }

  return 'Erro inesperado.';
}

function handleLaravelValidationErrors(errors: Record<string, string[]>): string {
  return Object.values(errors)
    .flat()
    .join(', ');
}

function handleAxiosResponseError(response: AxiosResponse): ExtractedAxiosError {
  const { data, status, statusText } = response;

  if (!data) {
    return {
      message: `Erro ${status}: ${statusText}`,
      status,
    };
  }

  // Laravel validation errors
  if (data.errors && typeof data.errors === 'object') {
    return {
      message: handleLaravelValidationErrors(data.errors),
      status,
    };
  }

  // Standard message
  if (data.message) {
    return {
      message: normalizeMessage(data.message),
      status,
    };
  }

  // Raw string response
  if (typeof data === 'string') {
    return {
      message: data,
      status,
    };
  }

  return {
    message: `Erro ${status}: ${statusText}`,
    status,
  };
}

function handleAxiosError(error: AxiosError): ExtractedAxiosError {
  if (error.response) {
    return handleAxiosResponseError(error.response);
  }

  if (error.request) {
    return {
      message: 'Nenhuma resposta do servidor. Verifique sua conexão.',
      status: 503,
    };
  }

  return {
    message: error.message || 'Erro inesperado.',
    status: 500,
  };
}

export function extractAxiosError(error: unknown): ExtractedAxiosError {
  if (isAxiosError(error)) {
    return handleAxiosError(error);
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: 'Erro inesperado.',
    status: 500,
  };
}