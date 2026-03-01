import * as yup from "yup";

export const userConfigSchema = yup.object({
    linkedin: yup
        .string()
        .url("Informe uma URL válida")
        .nullable()
        .notRequired(),

    github: yup
        .string()
        .url("Informe uma URL válida")
        .nullable()
        .notRequired(),

    portfolio: yup
        .string()
        .url("Informe uma URL válida")
        .nullable()
        .notRequired(),

    cellphone: yup
        .string()
        .matches(
            /^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})-?\d{4}$/,
            "Informe um celular válido"
        )
        .nullable()
        .notRequired(),
});

export type UserConfigForm = yup.InferType<typeof userConfigSchema>
