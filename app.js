import Groq from "groq-sdk";

const groq = new Groq();
async function main() {
  const response = await groq.chat.completions.create({
    temperature: 0.2,
    // top_p: 1,
    max_completion_tokens: 1000,
    stop: "today",
    // frequency_penalty: 1,
    // presence_penalty: 1,
    // stream: true,
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content:
          "You are an email classification expert. Classify emails into structured categories with confidence scores, priority levels, and suggested actions.",
      },
      {
        role: "user",
        content:
          "Subject: URGENT: Server downtime affecting production\n\nHi Team,\n\nOur main production server went down at 2:30 PM EST. Customer-facing services are currently unavailable. We need immediate action to restore services. Please join the emergency call.\n\nBest regards,\nDevOps Team",
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "email_classification",
        schema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: [
                "urgent",
                "support",
                "sales",
                "marketing",
                "internal",
                "spam",
                "notification",
              ],
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "critical"],
            },
            confidence_score: {
              type: "number",
              minimum: 0,
              maximum: 1,
            },
            sentiment: {
              type: "string",
              enum: ["positive", "negative", "neutral"],
            },
            key_entities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  entity: { type: "string" },
                  type: {
                    type: "string",
                    enum: [
                      "person",
                      "organization",
                      "location",
                      "datetime",
                      "system",
                      "product",
                    ],
                  },
                },
                required: ["entity", "type"],
                additionalProperties: false,
              },
            },
            suggested_actions: {
              type: "array",
              items: { type: "string" },
            },
            requires_immediate_attention: { type: "boolean" },
            estimated_response_time: { type: "string" },
          },
          required: [
            "category",
            "priority",
            "confidence_score",
            "sentiment",
            "key_entities",
            "suggested_actions",
            "requires_immediate_attention",
            "estimated_response_time",
          ],
          additionalProperties: false,
        },
      },
    },
  });
  // // Loop through the stream chunks as they arrive
  // for await (const chunk of stream) {
  //  JSON.stringify(process.stdout.write(chunk.choices[0]?.delta?.content || ""));
  // }
  const result = JSON.parse(response.choices[0].message.content || "{}");
  console.log(result);
}

main().catch(console.error);

// import Groq from "groq-sdk";

// const groq = new Groq();

// const response = await groq.chat.completions.create({
//   model: "openai/gpt-oss-120b",
//   messages: [
//     {
//       role: "system",
//       content:
//         "You are an email classification expert. Classify emails into structured categories with confidence scores, priority levels, and suggested actions.",
//     },
//     {
//       role: "user",
//       content:
//         "Subject: URGENT: Server downtime affecting production\n\nHi Team,\n\nOur main production server went down at 2:30 PM EST. Customer-facing services are currently unavailable. We need immediate action to restore services. Please join the emergency call.\n\nBest regards,\nDevOps Team",
//     },
//   ],
//   response_format: {
//     type: "json_schema",
//     json_schema: {
//       name: "email_classification",
//       schema: {
//         type: "object",
//         properties: {
//           category: {
//             type: "string",
//             enum: [
//               "urgent",
//               "support",
//               "sales",
//               "marketing",
//               "internal",
//               "spam",
//               "notification",
//             ],
//           },
//           priority: {
//             type: "string",
//             enum: ["low", "medium", "high", "critical"],
//           },
//           confidence_score: {
//             type: "number",
//             minimum: 0,
//             maximum: 1,
//           },
//           sentiment: {
//             type: "string",
//             enum: ["positive", "negative", "neutral"],
//           },
//           key_entities: {
//             type: "array",
//             items: {
//               type: "object",
//               properties: {
//                 entity: { type: "string" },
//                 type: {
//                   type: "string",
//                   enum: [
//                     "person",
//                     "organization",
//                     "location",
//                     "datetime",
//                     "system",
//                     "product",
//                   ],
//                 },
//               },
//               required: ["entity", "type"],
//               additionalProperties: false,
//             },
//           },
//           suggested_actions: {
//             type: "array",
//             items: { type: "string" },
//           },
//           requires_immediate_attention: { type: "boolean" },
//           estimated_response_time: { type: "string" },
//         },
//         required: [
//           "category",
//           "priority",
//           "confidence_score",
//           "sentiment",
//           "key_entities",
//           "suggested_actions",
//           "requires_immediate_attention",
//           "estimated_response_time",
//         ],
//         additionalProperties: false,
//       },
//     },
//   },
// });

// const result = JSON.parse(response.choices[0].message.content || "{}");
// console.log(result);
