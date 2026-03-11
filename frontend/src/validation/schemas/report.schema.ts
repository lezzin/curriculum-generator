import * as yup from 'yup';

export const reportSchema = yup.object({
  limit: yup
    .number()
    .typeError('O campo limit deve ser um número.')
    .required('O campo limit é obrigatório.')
    .min(1, 'O campo limit deve ser maior ou igual a 1.')
    .max(100, 'O campo limit deve ser menor ou igual a 100.'),

  initial_date_creation: yup
    .string()
    .required('O campo initial_date_creation é obrigatório.')
    .test(
      'is-valid-date',
      'O campo initial_date_creation deve ser uma data válida.',
      (value) => !value || !isNaN(Date.parse(value))
    ),

  final_date_creation: yup
    .string()
    .required('O campo final_date_creation é obrigatório.')
    .test(
      'is-valid-date',
      'O campo final_date_creation deve ser uma data válida.',
      (value) => !value || !isNaN(Date.parse(value))
    ),
});

export type ReportForm = yup.InferType<typeof reportSchema>;
