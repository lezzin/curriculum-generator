import { model } from "../ai/gemini"
import { buildResumePrompt } from "../ai/prompt"
import { ResumeOptions } from "../interfaces/resume.interfaces"

export async function generateAIResume(baseResume: any, jobDescription: string, options: ResumeOptions) {
  const prompt = buildResumePrompt(baseResume, jobDescription, options)

  const result = await model.generateContent(prompt)
  const response = await result.response
  const text = response.text()

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()

  return JSON.parse(cleaned)
}
