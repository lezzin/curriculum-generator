import * as yup from "yup";
import { focusAreas, languages, markets, seniorities, templateTypes, type BaseTemplateType, type FocusArea, type Language, type Market, type Seniority } from "../../../interfaces/resume.interfaces";

export const MAX_LENGTH = 3000;
export const MIN_LENGTH = 25;

export const resumeSchema = yup.object({
    jobText: yup.string()
        .required("Campo obrigatório")
        .min(MIN_LENGTH, `Mínimo ${MIN_LENGTH} caracteres`)
        .max(MAX_LENGTH, `Máximo ${MAX_LENGTH} caracteres`),

    language: yup.mixed<Language>()
        .oneOf(languages, "Idioma inválido")
        .required("Campo obrigatório"),

    seniority: yup.mixed<Seniority>()
        .oneOf(seniorities, "Senioridade inválida")
        .required("Campo obrigatório"),

    focusArea: yup.mixed<FocusArea>()
        .oneOf(focusAreas, "Área de atuação inválida")
        .required("Campo obrigatório"),

    market: yup.mixed<Market>()
        .oneOf(markets, "Mercado inválido")
        .required("Campo obrigatório"),

    templateType: yup.mixed<BaseTemplateType>()
        .oneOf(templateTypes, "Template inválido")
        .required("Campo obrigatório"),
})

export type ResumeForm = yup.InferType<typeof resumeSchema>

export const INITIAL_VALUES: Partial<ResumeForm> =
{
    language: 'PT' as Language,
    seniority: 'Junior' as Seniority,
    focusArea: 'Backend' as FocusArea,
    market: 'Brazil' as Market,
    templateType: 'default' as BaseTemplateType,
    jobText: '' as string,
}