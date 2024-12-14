import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
const prompt = `Attached is an image of a clinical report.
Go over the the clinical report and identify biomarkers that show slight or large
abnormalities. Then summarize in 100 words. You may increase the word limit if the report
has multiple pages. Do not output patient name, date etc. Make sure to include numerical
values and key details from the report, including report title.
## Summary: `;

export const POST = async (req: NextRequest) => {
  const { base64Data } = await req.json();
  const uploadedFile = fileToGenerativeModel(base64Data);
  const generatedContent = await model.generateContent([prompt, uploadedFile]);
  const response = generatedContent.response.text();
  return NextResponse.json(response, { status: 200 });
};

function fileToGenerativeModel(imageData: string) {
  return {
    inlineData: {
      data: imageData.split(",")[1],
      mimeType: imageData.substring(
        imageData.indexOf(":") + 1,
        imageData.indexOf(";")
      ),
    },
  };
}
