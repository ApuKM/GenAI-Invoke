import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq();
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `You're Guddu, a smart personal assistant who answers the asked questions.
           You have access to the following tools:
           1.get_weather({location}: {location: string})`,
      },
      {
        role: "user",
        content: "What is the current weather in Dhaka?",
      },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "get_weather",
          description: "Get current weather for a location",
          parameters: {
            // JSON Schema object
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "City and state, e.g. San Francisco, CA",
              },
              unit: {
                type: "string",
                enum: ["celsius", "fahrenheit"],
              },
            },
            required: ["location"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  const toolCalls = completion.choices[0]?.message?.tool_calls;
  if (!toolCalls) {
    console.log(`Assistant: ${completion.choices[0]?.message.content}`);
    return;
  }

  for (const tool of toolCalls) {
    // console.log("tool", tool);
    const functionName = tool.function.name;
    const functionParams = tool.function.arguments;

    if (functionName === "get_weather") {
      const toolResult = await get_weather(JSON.parse(functionParams));
      console.log("toolResult:", toolResult);
    }
  }
  //   console.log(completion.choices[0]?.message);
}

main().catch(console.error);

//get_weather tool(function)
async function get_weather({ location }) {
  console.log("get_weather function calling...");
  const response = await tvly.search(location);
//   console.log("Response", response);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
//   console.log("FinalResult:", finalResult);
  return finalResult;
}
