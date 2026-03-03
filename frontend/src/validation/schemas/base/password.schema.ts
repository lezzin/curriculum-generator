import * as yup from 'yup';

export const passwordSchema = yup
  .string()
  .required('Campo obrigatório')
  .min(3, 'Mínimo 3 caracteres')
  .matches(/[A-Z]/, 'Precisa ter pelo menos 1 letra maiúscula')
  .matches(/[a-z]/, 'Precisa ter pelo menos 1 letra minúscula')
  .matches(/\d/, 'Precisa ter pelo menos 1 número');
