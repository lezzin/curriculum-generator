import * as yup from "yup";
import { passwordSchema } from "./base/password.schema";

export const signupSchema = yup.object({
    name: yup.string().required("Campo obrigatório").min(3, "Mínimo 3 caracteres"),
    email: yup.string().email("Email inválido").required("Campo obrigatório"),
    password: passwordSchema
})

export type SignUpForm = yup.InferType<typeof signupSchema>
