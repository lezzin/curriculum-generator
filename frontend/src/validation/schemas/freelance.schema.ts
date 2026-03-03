import * as yup from 'yup';

export const MAX_LENGTH = 3000;
export const MIN_LENGTH = 25;

export const freelanceSchema = yup.object({
    solicitationText: yup.string()
        .required("Campo obrigatório")
        .min(MIN_LENGTH, `Mínimo ${MIN_LENGTH} caracteres`)
        .max(MAX_LENGTH, `Máximo ${MAX_LENGTH} caracteres`),
})

export type FreelanceForm = yup.InferType<typeof freelanceSchema>