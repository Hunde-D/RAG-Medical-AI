"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useChat } from "ai/react";
import { useRef, useState } from "react";
import { CornerDownLeft } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useEventListener } from "usehooks-ts";
import { toast } from "sonner";

const Chat = ({ reportData }: { reportData: string }) => {
  const [error, setError] = useState<string | null>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          id: "welcome",
          role: "assistant",
          content: "Hello!",
        },
      ],
      api: "/api/chat",
      maxSteps: 5,
      onError: () => {
        toast.error(
          "Reached daily free request limit. Please try again later."
        );
        setError(
          "An error occurred while processing your request. Please try again."
        );
      },
    });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit(); // Modern and validation-safe
    }
  };

  useEventListener("keydown", handleKeyDown);

  return (
    <>
      <ScrollArea className="flex-1">
        <div className="h-full overflow-auto p-3">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap my-2">
              <div
                className={cn(
                  "w-full flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "py-2 px-5 w-fit text-sm",
                    m.role === "user"
                      ? "justify-end bg-muted rounded-3xl"
                      : "justify-start flex gap-4 items-center"
                  )}
                >
                  {m.role !== "user" && (
                    <div className="p-1 rounded-full border size-fit text-sm">
                      🤖
                    </div>
                  )}
                  <p>{m.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="w-full flex justify-start">
              <div className="py-2 px-5 w-fit text-sm flex gap-4">
                <div className="p-1 rounded-full border size-fit text-sm">
                  🤖
                </div>
                <p className="animate-pulse">Thinking...</p>
              </div>
            </div>
          )}
          {error && (
            <div className="w-full flex justify-start">
              <div className="py-2 px-5 w-fit text-sm flex gap-4">
                <div className="p-1 rounded-full border size-fit text-sm">
                  🤖
                </div>
                <p className="text-destructive">Error: {error}</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e, { data: reportData });
        }}
        className="rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="w-full flex justify-end p-2">
          <Button type="submit" className="flex gap-3" disabled={isLoading}>
            {isLoading ? "Thinking..." : "Ask"} <CornerDownLeft />
          </Button>
        </div>
      </form>
    </>
  );
};

export default Chat;
