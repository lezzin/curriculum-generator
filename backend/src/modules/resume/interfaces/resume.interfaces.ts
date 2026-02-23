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
