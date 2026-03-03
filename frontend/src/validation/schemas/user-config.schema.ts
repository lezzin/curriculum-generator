import * as yup from 'yup';

function validateHostname(hostname: string, value: string | null | undefined): boolean {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.hostname.includes(hostname);
  } catch {
    return false;
  }
}

export const userConfigSchema = yup.object({
  linkedin: yup
    .string()
    .nullable()
    .notRequired()
    .test('is-linkedin', 'Informe uma URL válida do LinkedIn', (value) => validateHostname('linkedin.com', value)),

  github: yup
    .string()
    .nullable()
    .notRequired()
    .test('is-github', 'Informe uma URL válida do GitHub', (value) => validateHostname('github.com', value)),

  portfolio: yup.string().url('Informe uma URL válida').nullable().notRequired(),

  cellphone: yup
    .string()
    .matches(/^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})-?\d{4}$/, 'Informe um celular válido')
    .nullable()
    .notRequired(),
});

export type UserConfigForm = yup.InferType<typeof userConfigSchema>;
