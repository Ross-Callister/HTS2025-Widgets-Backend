import { ChatMessage } from "@langchain/core/messages";
import { ChatPromptValue } from "@langchain/core/prompt_values";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import cors from "cors";
import express from "express";
import { getWidgetListContext } from "./widgets/widgets";
import { ChatBedrockConverse } from "@langchain/aws";

const app = express();
app.use(cors());
app.use(express.json());

// const model = new ChatOpenAI({
//   // model: "deepseek-ai/DeepSeek-V3-0324",
//   model: "google/gemma-3-27b-it",
//   apiKey: process.env.FEATHERLESS_API_KEY,
//   configuration: {
//     baseURL: "https://api.featherless.ai/v1",
//   },
//   timeout: 10_000,
// });

const model = new ChatBedrockConverse({
  model: "us.amazon.nova-micro-v1:0",
  region: "us-west-2",
});

const translationPrompt =
  "Translate the following text from English into {language}: {text}";
const translationTemplate = ChatPromptTemplate.fromMessages([
  ["system", translationPrompt],
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
      return res.status(400).json({
        error:
          "Please provide both text and language as strings in the request body",
      });
    }

    const promptValue = await translationTemplate.invoke({
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

app.post("/widgets", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Please provide a valid text string in the request body",
      });
    }

    const response = await model.invoke(
      new ChatPromptValue({
        messages: [
          new ChatMessage({
            role: "system",
            content: getWidgetListContext(),
          }),
          new ChatMessage({
            role: "user",
            content: text,
          }),
        ],
      })
    );

    return res.json({ response: response.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Widget chat failed" });
  }
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
