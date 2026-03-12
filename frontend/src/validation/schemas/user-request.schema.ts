import * as yup from 'yup';

export const userRequestSchema = yup.object({
  name: yup
    .string()
    .nullable('Campo obrigatório'),

  email: yup
    .string()
    .email('Email inválido')
    .nullable('Campo obrigatório'),

  initial_date_creation: yup
    .string()
    .nullable()
    .test(
      'is-valid-date',
      'O campo data inicial deve ser uma data válida.',
      (value) => !value || !isNaN(Date.parse(value))
    ),

  final_date_creation: yup
    .string()
    .nullable()
    .test(
      'is-valid-date',
      'O campo data final deve ser uma data válida.',
      (value) => !value || !isNaN(Date.parse(value))
    ),
});

export type ReportRequestForm = yup.InferType<typeof userRequestSchema>;
