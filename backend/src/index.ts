import express from "express"
import { baseResume } from "./data/resume"
import { generateAIResume } from "./services/generator"

var cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.post("/generate", async (req, res) => {
    const { jobDescription, options } = req.body

    try {
        const generated = await generateAIResume(
            baseResume,
            jobDescription,
            options
        )

        res.json(generated)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Generation failed" })
    }
})

app.listen(3001, () => {
    console.log("Server running on port 3001")
})
