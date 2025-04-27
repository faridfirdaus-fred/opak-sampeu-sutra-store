import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey:
      "ts-node testOpenAI.ts",
  })
);

async function testOpenAI() {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: "Hello!" }],
    });
    console.log(response.data);
  } catch (error) {
    console.error("OpenAI API error:", error);
  }
}

testOpenAI();
