// import { google } from "@ai-sdk/google";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, streamText, tool } from "ai";
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
});
export async function POST(req: Request) {
  const { messages, data } = await req.json();
  const { text } = await generateText({
    model: google("gemini-1.5-pro-latest"),
    prompt: "Write a vegetarian lasagna recipe for 4 people.",
  });
  const result = streamText({
    model: model,
    messages,
    tools: {
      medicalReport: tool({
        description: "Get the medical report of the patient",
        parameters: z.object({
          age: z.string().describe("patients age").optional(),
        }),
        execute: async () => {
          const report = data;
          return {
            report,
          };
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
