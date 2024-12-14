import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useChat } from "ai/react";

const Chat = ({ reportData }: { reportData: string }) => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      {/* <div className="h-full flex flex-col rounded-xl bg-muted/50 p-6 lg:col-span-2"> */}
      <Badge variant="outline" className="absolute right-3 top-3">
        No Reports Added
      </Badge>
      <div className="flex-1" />
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === "user" ? "User: " : "AI: "}
          {m.content}
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e, { data: reportData });
        }}
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
      </form>
    </>
  );
};

export default Chat;
