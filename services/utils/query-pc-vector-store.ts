import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";
const inference = new HfInference(process.env.HF_API_KEY!);
const model = "multilingual-e5-large";
export const queryPcVectorStore = async (
  client: Pinecone,
  indexName: string,
  namespace: string,
  query: string,
  query2: string[]
): Promise<string> => {
  const queryEmbedding = await client.inference.embed(model, query2, {
    inputType: "query",
  });
  const hfOutput = await inference.featureExtraction({
    model: "intfloat/multilingual-e5-large",
    inputs: query,
  });

  const index = client.index(indexName);
  const queryEmbedding2 = Array.from(hfOutput);
  const queryResponse2 = await index.namespace("medic").query({
    topK: 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vector: queryEmbedding2 as any,
    includeValues: false,
    includeMetadata: true,
  });
  const queryResponse = await index.namespace("medic").query({
    topK: 1,
    vector: queryEmbedding[0]?.values || [],
    includeValues: false,
    includeMetadata: true,
  });

  console.log("response 1", queryResponse);
  console.log("response 2", queryResponse2);
  // console.log("hf1", hfOutput);
  // console.log("queryEmbedding2", queryEmbedding);
  return "";
};
