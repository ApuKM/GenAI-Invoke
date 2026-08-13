import Groq from "groq-sdk";

const groq = new Groq();
async function main() {
  const completion = await groq.chat.completions.create({
    temperature: 0.2,
    // top_p: 1,
    stop: "today",
    max_completion_tokens: 1000,
    // frequency_penalty: 1,
    // presence_penalty: 1,
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are Guddu, a smart personal assistant. Be always polite.",
      },
      {
        role: "user",
        content: "Who are you?",
      },
    ],
  });
  console.log(completion.choices[0]?.message?.content);
}

main().catch(console.error);
