export type Language = "PT" | "EN"
export type Seniority = "Junior" | "Mid-level"
export type FocusArea = "Backend" | "Fullstack" | "Microservices" | "DevOps"
export type Market = "Brazil" | "US" | "Europe"

export type ResumeOptions = {
    language: Language
    targetSeniority: Seniority
    focusArea: FocusArea
    market: Market
}

export interface ResumeProject {
    name: string
    highlights: string[]
    technologies: string[]
}

export interface Resume {
    id?: string
    userId?: string
    createdAt?: string
    prompt?: string
    name: string
    language: string
    role: string
    summary: string
    skills: string[]
    experiences: {
        title: string
        company: string
        period: string
        responsibilities: string[]
        technologies: string[]
    }[]
    projects?: ResumeProject[]
}

export const BASE_TEMPLATE_TYPES = {
    DEFAULT: 'default',
    CLASSIC: 'classic',
    CONDENSED: 'condensed',
} as const

export type BaseTemplateType = typeof BASE_TEMPLATE_TYPES[keyof typeof BASE_TEMPLATE_TYPES]