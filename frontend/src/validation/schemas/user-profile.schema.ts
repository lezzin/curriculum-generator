import * as yup from 'yup';

export const setUserProfileSchema = yup.object({
    name: yup.string().min(3, 'Nome muito curto').required('Nome obrigatório'),
});

export type SetUserProfileForm = yup.InferType<typeof setUserProfileSchema>;
