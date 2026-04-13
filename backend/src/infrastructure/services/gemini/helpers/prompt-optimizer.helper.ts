interface ResumeData {
    summary?: string;
    skills?: string[];
    experiences?: Array<{
        title: string;
        company: string;
        period: string;
        responsibilities: string[];
        technologies: string[];
    }>;
    projects?: Array<{
        name: string;
        highlights: string[];
        technologies: string[];
    }>;
}

interface OptimizedPayload {
    sum: string;
    skills: string;
    exp: Array<{
        role: string;
        co: string;
        period: string;
        resp: string[];
        tech: string;
    }>;
    proj: Array<{
        name: string;
        hi: string[];
        tech: string;
    }>;
}

export function optimize(data: ResumeData): OptimizedPayload {
    const parsed: ResumeData = typeof data === 'string' ? JSON.parse(data) : data;

    return {
        sum: parsed.summary ?? '',
        skills: (parsed.skills ?? []).join(', '),
        exp: (parsed.experiences ?? []).map((e) => ({
            role: e.title,
            co: e.company,
            period: e.period,
            resp: e.responsibilities,
            tech: e.technologies.join(', '),
        })),
        proj: (parsed.projects ?? []).map((p) => ({
            name: p.name,
            hi: p.highlights,
            tech: p.technologies.join(', '),
        })),
    };
}

export function toPromptString(data: ResumeData): string {
    return JSON.stringify(optimize(data));
}
