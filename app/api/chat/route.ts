import { google } from "@ai-sdk/google";
import { streamText } from "ai";
// const model = google("gemini-1.5-pro-latest");

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-1.5-pro-latest"),
    messages,
  });

  return result.toDataStreamResponse();
}
