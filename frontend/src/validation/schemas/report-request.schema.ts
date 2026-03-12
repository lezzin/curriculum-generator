import * as yup from 'yup';

export const reportRequestSchema = yup.object({
  initial_date_creation: yup
    .string()
    .required('O campo data inicial é obrigatório.')
    .test(
      'is-valid-date',
      'O campo data inicial deve ser uma data válida.',
      (value) => !value || !isNaN(Date.parse(value))
    ),

  final_date_creation: yup
    .string()
    .required('O campo data final é obrigatório.')
    .test(
      'is-valid-date',
      'O campo data final deve ser uma data válida.',
      (value) => !value || !isNaN(Date.parse(value))
    ),
});

export type ReportRequestForm = yup.InferType<typeof reportRequestSchema>;
