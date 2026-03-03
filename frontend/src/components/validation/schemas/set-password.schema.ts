import * as yup from "yup";
import { passwordSchema } from "./base/password.schema";

export const setPasswordSchema = yup.object({
    password: passwordSchema
});

export type SetPasswordForm = yup.InferType<typeof setPasswordSchema>;