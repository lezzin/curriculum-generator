import * as yup from 'yup';

export const resumeReportSchema = yup.object({
    initial_date_creation: yup
        .string()
        .required('O campo initial_date_creation é obrigatório.')
        .test(
            'is-valid-date',
            'O campo initial_date_creation deve ser uma data válida.',
            (value) => !value || !isNaN(Date.parse(value))
        ),

    final_date_creation: yup
        .string()
        .required('O campo final_date_creation é obrigatório.')
        .test(
            'is-valid-date',
            'O campo final_date_creation deve ser uma data válida.',
            (value) => !value || !isNaN(Date.parse(value))
        ),
});

export type ResumeReportForm = yup.InferType<typeof resumeReportSchema>;