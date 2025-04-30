import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const model = new ChatOpenAI({
  model: "deepseek-ai/DeepSeek-V3-0324",
  apiKey: process.env.FEATHERLESS_API_KEY,
  configuration: {
    baseURL: "https://api.featherless.ai/v1",
  },
  timeout: 10_000,
});

const systemTemplate =
  "Translate the following text from English into {language}: {text}";
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
]);

app.post("/uppercase", (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== "string") {
    return res
      .status(400)
      .json({ error: "Please provide a text string in the request body" });
  }
  res.json({ result: text.toUpperCase() });
});

app.post("/translate", async (req, res) => {
  try {
    const { text, language } = req.body;
    if (
      !text ||
      !language ||
      typeof text !== "string" ||
      typeof language !== "string"
    ) {
      return res
        .status(400)
        .json({
          error:
            "Please provide both text and language as strings in the request body",
        });
    }

    const promptValue = await promptTemplate.invoke({
      language,
      text,
    });

    const response = await model.invoke(promptValue);
    res.json({ translation: response.content });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
