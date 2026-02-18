import { ResumeOptions } from "../interfaces/resume.interfaces";

export function buildResumePrompt(
  baseResume: any,
  jobDescription: string,
  options: ResumeOptions
): string {
  return `
You are a senior technical resume strategist, ATS optimization expert, and hiring-market specialist.

Your mission:
Transform the BASE RESUME into a highly optimized, market-aligned, ATS-strong resume tailored to the JOB DESCRIPTION and CONFIGURATION.

==============================
CONFIGURATION
==============================
Language: ${options.language}
Target Seniority: ${options.targetSeniority}
Focus Area: ${options.focusArea}
Market: ${options.market}

==============================
JOB DESCRIPTION
==============================
${jobDescription}

==============================
BASE RESUME
==============================
${JSON.stringify(baseResume, null, 2)}

==================================================
CORE OPTIMIZATION DIRECTIVES
==================================================

1. Extract required technologies, architecture keywords, and performance concepts.
2. Maximize ATS alignment naturally.
3. Rewrite summary (3–5 lines).
4. Structure experiences clearly with line breaks.
5. Integrate projects explicitly if they exist.
6. Adapt tone based on seniority and market.

==================================================
PROJECT INTEGRATION (MANDATORY)
==================================================

If projects exist:
- Present each as separate initiative.
- Format:

Project Name — short positioning sentence
• Technical implementation
• Architecture/design decision
• Tools used (if relevant)
• Measurable outcome (only if metric exists)

Do NOT merge into one paragraph.

==================================================
QUALITY RULES
==================================================

- Do NOT invent experience.
- Do NOT fabricate metrics.
- Do NOT exaggerate seniority.
- Avoid generic phrases.
- Keep technical credibility.
- Keep descriptions structured with \\n line breaks.
- Remove unrelated tools.
- Return ONLY valid JSON.

==================================================
OUTPUT FORMAT
==================================================

{
  "name": "",
  "role": "",
  "summary": "",
  "skills": [],
  "experiences": [
    {
      "title": "",
      "company": "",
      "period": "",
      "description": "",
      "technologies": []
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": []
    }
  ]
}

RULES FOR PROJECTS SECTION:
- Include only relevant projects aligned with the job description.
- Each project must be concise but structured.
- Description must use line breaks (\\n) and bullet-style formatting.
- Do NOT duplicate content already fully described inside experiences.
- Do NOT invent projects.

Return ONLY valid JSON.
No markdown.
No explanations.
Only JSON.
`
}
