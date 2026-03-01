import * as yup from "yup";

export const signupSchema = yup.object({
    name: yup.string().required("Campo obrigatório").min(3, "Mínimo 3 caracteres"),
    email: yup.string().email("Email inválido").required("Campo obrigatório"),
    password: yup.string().required("Campo obrigatório").min(3, "Mínimo 3 caracteres")
})

export type SignUpForm = yup.InferType<typeof signupSchema>
