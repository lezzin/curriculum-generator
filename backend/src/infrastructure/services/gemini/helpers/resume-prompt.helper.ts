import { ResumeOptions } from 'src/application/models/input/resume.input';

export function buildResumePrompt(
  baseResume: any,
  jobDescription: string,
  options: ResumeOptions,
): string {
  return `
You are a senior technical recruiter and ATS optimization expert.

GOAL:
Transform the BASE RESUME into a highly targeted resume for the JOB DESCRIPTION.

==================================================
CONFIG
==================================================

Language: ${options.language}
Seniority: ${options.targetSeniority}
Focus: ${options.focusArea}
Market: ${options.market}

==================================================
INPUT
==================================================

JOB DESCRIPTION:
${jobDescription}

BASE RESUME (ONLY SOURCE OF TRUTH):
${JSON.stringify(baseResume)}

==================================================
HARD DATA RULES (CRITICAL)
==================================================

You MUST NOT:
• Invent metrics
• Invent technologies
• Invent companies or roles
• Upgrade seniority artificially

If data is missing:
→ Rephrase, DO NOT invent

==================================================
WRITING RULES
==================================================

• Use ${options.language}
• Be concise and specific
• Avoid generic buzzwords
• Prefer strong action verbs

==================================================
SUMMARY (MAX 60 WORDS)
==================================================

Format:
[Seniority] [Role] with [X]+ years in [Focus Area]. 
[1 strong achievement from base data].
Strong in [top 3 relevant technologies].

==================================================
EXPERIENCE
==================================================

Each experience:
• 3–5 bullet points
• Format:
  ACTION + TECH + CONTEXT + IMPACT

If no metric:
→ describe purpose or outcome

Examples:
"Built API using NestJS to handle async jobs, improving reliability."
"Optimized queries in PostgreSQL to reduce response time."

==================================================
SKILLS
==================================================

• Only from BASE DATA
• Max 15
• Ordered by relevance:
  1. Core Tech
  2. Frameworks
  3. Databases
  4. Infra

==================================================
PROJECTS
==================================================

• Include only relevant ones
• Highlight impact or purpose
• No invention

==================================================
OUTPUT (STRICT JSON)
==================================================

Return ONLY valid JSON:

{
  "name": string,
  "language": "${options.language}",
  "role": string,
  "summary": string,
  "skills": string[],
  "experiences": [
    {
      "title": string,
      "company": string,
      "period": string,
      "responsibilities": string[],
      "technologies": string[]
    }
  ],
  "projects": [
    {
      "name": string,
      "highlights": string[],
      "technologies": string[]
    }
  ]
}

==================================================
FINAL VALIDATION
==================================================

Before answering:
• JSON is valid?
• No invented data?
• Skills <= 15?
• Summary <= 60 words?
• Language correct?

If not → FIX before returning.
`;
}