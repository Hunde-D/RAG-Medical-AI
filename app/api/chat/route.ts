// import { google } from "@ai-sdk/google";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool } from "ai";
// import { Pinecone } from "@pinecone-database/pinecone";
// import { queryPcVectorStore } from "@/services/utils/query-pc-vector-store";
// import { randomUUID } from "crypto";

// const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
// const model = "multilingual-e5-large";
const google = createGoogleGenerativeAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
  apiKey: process.env.GEMINI_API_KEY,
});
const model = google("models/gemini-1.5-pro-latest", {
  safetySettings: [
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
  ],
  useSearchGrounding: true,
});
export async function POST(req: Request) {
  const { messages, data } = await req.json();
  const result = streamText({
    model: model,
    messages,
    system: `
    - You are an AI health assistant that helps users understand their medical reports and provides general health advice.
    - Keep your responses concise and focused on health-related topics.
    - Today's date is ${new Date().toLocaleDateString()}.
    - You can discuss general health topics even if no medical report is provided.
    - If the user asks about their specific condition without providing a report, request that they upload one.
    - When a report is available:
      - Explain medical terms in simple language
      - Highlight any abnormal results
      - Suggest general lifestyle improvements based on the report
      - Recommend follow-up actions if necessary
    - If the user hasn't provided a medical report and asks about it:
      - Suggest uploading an image or pdf of the report for extraction
      - Mention that including past medical history could provide better results
      - Offer the option to copy and paste the extracted report text
    - Always check if a report has been provided before discussing it
    - If a new report is uploaded, acknowledge it and offer to analyze the new information
    - Do not diagnose conditions or prescribe treatments; always advise consulting with a healthcare professional for specific medical advice.
    - If asked about non-health topics (e.g., sports, coding), politely remind the user that you're a health assistant and can only discuss health-related matters.
    - Optimal conversation flow:
      - Greet the user and engage in general health discussions
      - If user asks about their condition, request a medical report if not provided
      - Once a report is available, review it and provide a summary
      - Answer user's questions about the report
      - Offer general health advice based on the report
      - Suggest lifestyle improvements if applicable
      - Recommend consulting a healthcare professional for specific concerns
  `,
    tools: {
      medicalReport: tool({
        description: "Get the medical report of the patient",
        parameters: z.object({
          requestReport: z
            .boolean()
            .describe("Set to true to request the medical report"),
        }),
        execute: async ({ requestReport }) => {
          if (requestReport && data) {
            return {
              reportAvailable: true,
              reportSummary: data.reportSummary,
            };
          } else {
            return {
              reportAvailable: false,
              reportSummary: null,
            };
          }
        },
      }),
    },
  });
  console.log("result", result);
  console.log("result2", result.toDataStreamResponse());
  // const report = [{ id: randomUUID().toString(), text: data }];
  // const embeddings = await pc.inference.embed(
  //   model,
  //   report.map((r) => r.text),
  //   { inputType: "passage", truncate: "END" }
  // );
  // // console.log("report", embeddings);
  // if (!embeddings) {
  //   return new Response("Error", { status: 400 });
  // }
  // const index = pc.index("medic");
  // const records = report.map((r, i) => ({
  //   id: r.id,
  //   values: embeddings[i].values!,
  //   metadata: { text: r.text },
  // }));
  // await index.namespace("ns1").upsert(records);
  // const reportData = [data.reportData];
  // const userQuestion = messages[messages.length - 1].content;

  // const searchQuery = `Represent this for searching relevant passages: Patient medical report says: \n${data} \n\n ${userQuestion}`;
  // const searchQuery2 = `${userQuestion}`;
  // const retrivals = await queryPcVectorStore(pc, "medic", "ns1", searchQuery, [
  //   searchQuery2,
  // ]);
  // const result = streamText({
  //   model: google("gemini-1.5-pro-latest"),
  //   messages,
  // });
  // return new Response("Hello World", { status: 200 });
  return result.toDataStreamResponse();
}
