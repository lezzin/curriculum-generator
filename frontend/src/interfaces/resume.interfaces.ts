export type Language = 'PT' | 'EN';
export type Seniority = 'Junior' | 'Mid-level';
export type FocusArea = 'Backend' | 'Fullstack' | 'Microservices' | 'DevOps';
export type Market = 'Brazil' | 'US' | 'Europe';

export interface ResumeProject {
  name: string;
  highlights: string[];
  technologies: string[];
}

export interface Resume {
  id: string;
  userId: string;
  prompt: string;
  template: BaseTemplateType;
  createdAt: Date;
}

export type BaseTemplateType = (typeof BASE_TEMPLATE_TYPES)[keyof typeof BASE_TEMPLATE_TYPES];

export const BASE_TEMPLATE_TYPES = {
  DEFAULT: 'default',
  CLASSIC: 'classic',
  CONDENSED: 'condensed',
} as const;

export const LANGUAGES = {
  PT: 'PT',
  EN: 'EN',
} as const;

export const SENIORITIES = {
  JUNIOR: 'Junior',
  MID: 'Mid-level',
} as const;

export const FOCUS_AREAS = {
  BACKEND: 'Backend',
  FULLSTACK: 'Fullstack',
  MICROSERVICES: 'Microservices',
  DEVOPS: 'DevOps',
} as const;

export const MARKETS = {
  BRAZIL: 'Brazil',
  US: 'US',
  EUROPE: 'Europe',
} as const;

export const languages = Object.values(LANGUAGES) as Language[];
export const seniorities = Object.values(SENIORITIES) as Seniority[];
export const focusAreas = Object.values(FOCUS_AREAS) as FocusArea[];
export const markets = Object.values(MARKETS) as Market[];
export const templateTypes = Object.values(BASE_TEMPLATE_TYPES) as BaseTemplateType[];
