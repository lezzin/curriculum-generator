export type ResumeOptions = {
    language: "PT" | "EN"
    targetSeniority: "Junior" | "Mid-level"
    focusArea: "Backend" | "Fullstack" | "Microservices" | "DevOps"
    market: "Brazil" | "US" | "Europe"
}

export interface ResumeProject {
    name: string
    description: string
    technologies: string[]
}

export interface Resume {
    name: string
    role: string
    summary: string
    skills: string[]
    experiences: {
        title: string
        company: string
        period: string
        description: string
        technologies: string[]
    }[]
    projects?: ResumeProject[]
}
