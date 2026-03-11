export const PROCESS_STATUS = {
  WAITING: 1,
  PROCESSING: 2,
  SUCCEEDED: 3,
  FAILED: 4,
  EXPIRED: 5,
  CANCELLED: 6,
} as const;

export type ProcessStatus = (typeof PROCESS_STATUS)[keyof typeof PROCESS_STATUS];
