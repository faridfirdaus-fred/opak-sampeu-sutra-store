import OpenAI from "openai";

const openai = new OpenAI({
  apiKey:
    "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",
});

async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Hello!" }],
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI API error:", error);
  }
}

testOpenAI();
