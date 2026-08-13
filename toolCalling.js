import Groq from "groq-sdk";

const groq = new Groq();
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
        content: "What is the current weather in Rajshahi?",
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
    console.log("tool", tool);
    const functionName = tool.function.name;
    const functionParams = tool.function.arguments;

    if (functionName === "get_weather") {
      const toolResult = await get_weather(JSON.parse(functionParams));
      console.log("toolResult", toolResult);
    }
  }
  //   console.log(completion.choices[0]?.message);
}

main().catch(console.error);

//get_weather tool(function) 
async function get_weather({ location }) {
  console.log("get_weather function calling...");
  return "The current weather in Moscow is 28 degree celcius";
}
