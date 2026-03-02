import * as yup from "yup";

export const userConfigSchema = yup.object({
    linkedin: yup
        .string()
        .nullable()
        .notRequired()
        .test("is-linkedin", "Informe uma URL válida do LinkedIn", (value) => {
            if (!value) return true
            try {
                const url = new URL(value)
                return url.hostname.includes("linkedin.com")
            } catch {
                return false
            }
        }),

    github: yup
        .string()
        .nullable()
        .notRequired()
        .test("is-github", "Informe uma URL válida do GitHub", (value) => {
            if (!value) return true
            try {
                const url = new URL(value)
                return url.hostname.includes("github.com")
            } catch {
                return false
            }
        }),

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
