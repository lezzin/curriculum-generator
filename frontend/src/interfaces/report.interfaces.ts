import type { ProcessStatus } from '../types/report.types';

export interface ReportItem {
  id: string;
  progress_id: string;
  total_records: number;
  report_name: string;
  processed_records: number;
  final_file_path: string;
  started_at: string;
  finished_at: string;
  created_at: string;
  status_id: ProcessStatus;
  status_name: string;
  percentage: number;
}

export interface Meta {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}
