import * as yup from "yup";

export const authSchema = yup.object({
    email: yup.string().email("Email inválido").required("Campo obrigatório"),
    password: yup.string().required("Campo obrigatório").min(3, "Mínimo 3 caracteres")
})

export type AuthForm = yup.InferType<typeof authSchema>
