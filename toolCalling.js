import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq();
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
  const messages = [
    {
      role: "system",
      content: `You're Guddu, a smart personal assistant who answers the asked questions.
           You have access to the following tools:
           1.webSearch({query}: {query: string})`,
    },
    {
      role: "user",
      content: "hen was I phone 17 was launched?",
      //What is the current weather in Rajshahi?
      //When was I phone 17 was launched?
    },
  ];

  while (true) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description: "Get the latest data for searched query",
            parameters: {
              // JSON Schema object
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "User searched query",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    messages.push(completion.choices[0].message);

    const toolCalls = completion.choices[0]?.message?.tool_calls;
    if (!toolCalls) {
      console.log(`Assistant: ${completion.choices[0]?.message.content}`);
      break;
    }

    for (const tool of toolCalls) {
      // console.log("tool", tool);
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionParams));
        //   console.log("toolResult:", toolResult);
        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
  }
}

main().catch(console.error);

//get_weather tool(function)
async function webSearch({ query }) {
  console.log("webSearch function calling...");
  const response = await tvly.search(query);
  //   console.log("Response", response);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  //   console.log("FinalResult:", finalResult);
  return finalResult;
}
