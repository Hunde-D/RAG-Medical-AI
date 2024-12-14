import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import compressImage from "@/services/utils/compress-image";

const Report = ({
  onReportConfirmation,
}: {
  onReportConfirmation: (data: string) => void;
}) => {
  const [base64Data, setBase64Data] = useState("");
  const [reportData, setReportData] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function handleReport(event: ChangeEvent<HTMLInputElement>): void {
    console.log(event);
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;
    let isValidImage = false;
    let isValidDoc = false;

    const vaidImage = ["image/jpeg", "image/png", "image/webp"];
    const validDoc = ["application/pdf"];

    if (vaidImage.includes(file.type)) {
      isValidImage = true;
      compressImage(file, (compressedFile: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const fileContent = reader.result as string;
          setBase64Data(fileContent);
        };
        reader.readAsDataURL(compressedFile);
      });
    }
    if (validDoc.includes(file.type)) {
      isValidDoc = true;
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileContent = reader.result as string;
        setBase64Data(fileContent);
      };
      reader.readAsDataURL(file);
    }
    if (!(isValidImage || isValidDoc)) {
      toast.error(
        <div className=" text-center">
          <p className=" font-bold flex gap-2">
            <AlertCircle />
            Invalid file type
          </p>
          <p>Supported file types jpeg, png, webp and pdf</p>
        </div>
      );
      return;
    }
  }

  async function extractDetails(): Promise<void> {
    if (!base64Data) {
      toast.error("No valid report uploaded");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ base64Data }),
    });

    if (response.ok) {
      const data = await response.text();
      setReportData(data);
      setLoading(false);
    }
  }

  function handleConfirmation(): void {
    if (!reportData) {
      toast.error("No report data to confirm");
      return;
    }
    onReportConfirmation(reportData);
  }

  return (
    <div className="grid w-full items-start gap-6 py-4 pt-0 overflow-auto ">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="text-sm font-medium">Report</legend>
        {loading && (
          <div className="absolute z-10 size-full bg-card/90 rounded-lg flex flex-row justify-center items-center">
            <p className=" animate-pulse">Extracting...</p>
          </div>
        )}
        <Input type="file" onChange={handleReport} />
        <Button onClick={extractDetails}>Upload File</Button>
        <Label>Report Summary</Label>
        <Textarea
          value={reportData}
          onChange={(e) => setReportData(e.target.value)}
          className="text-sm resize-none min-h-72 border-none p-3 shadow-none focus-visible:ring-0"
          placeholder="Extracted data from the report will appear here. Get better recommendations by providing additional patient history and symptoms..."
        />
        <Button className="my-4" onClick={handleConfirmation} variant="outline">
          Looks Good
        </Button>
      </fieldset>
    </div>
  );
};

export default Report;
