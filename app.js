import Groq from "groq-sdk";

const groq = new Groq();
async function main() {
  const stream = await groq.chat.completions.create({
    temperature: 0.2,
    // top_p: 1,
    max_completion_tokens: 1000,
    stop: "today",
    // frequency_penalty: 1,
    // presence_penalty: 1,
    stream: true,
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
  // Loop through the stream chunks as they arrive
  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
 
}

main().catch(console.error);
