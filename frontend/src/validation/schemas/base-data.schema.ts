import * as yup from 'yup';

export const baseDataSchema = yup.object({
  summary: yup.string().min(10, 'Resumo muito curto').required('Resumo obrigatório'),

  skillsString: yup.string(),

  experiences: yup.array().of(
    yup.object({
      title: yup.string().required('Cargo obrigatório'),
      company: yup.string().required('Empresa obrigatória'),
      period: yup.string().required('Período obrigatório'),
      responsibilitiesString: yup.string().min(3, 'Adicione ao menos uma responsabilidade'),
      technologiesString: yup.string(),
    })
  ),

  projects: yup.array().of(
    yup.object({
      name: yup.string().required('Nome obrigatório'),
      highlightsString: yup.string().min(3, 'Adicione ao menos um destaque'),
      technologiesString: yup.string(),
    })
  ),
});

export type BaseDataForm = yup.InferType<typeof baseDataSchema>;

export const INITIAL_VALUES: Partial<BaseDataForm> = {
  summary: '',
  skillsString: '',
  experiences: [],
  projects: [],
};
