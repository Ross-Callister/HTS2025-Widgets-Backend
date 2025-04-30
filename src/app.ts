import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

async function main() {
  const model = new ChatOpenAI({
    model: "deepseek-ai/DeepSeek-V3-0324",
    apiKey: process.env.FEATHERLESS_API_KEY,
    configuration: {
      baseURL: "https://api.featherless.ai/v1",
    },
    timeout: 10_000,
  });

  const systemTemplate = "Translate the following from English into {language}";
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"],
  ]);

  const promptValue = await promptTemplate.invoke({
    language: "french",
    text: "hi!",
  });

  console.log(promptValue.toChatMessages());

  const response = await model.invoke(promptValue);
  console.log(`${response.content}`);
}

main();
