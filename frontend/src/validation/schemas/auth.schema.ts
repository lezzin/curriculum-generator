import * as yup from 'yup';
import { passwordSchema } from './base/password.schema';

export const authSchema = yup.object({
  email: yup.string().email('Email inválido').required('Campo obrigatório'),
  password: passwordSchema,
});

export type AuthForm = yup.InferType<typeof authSchema>;
