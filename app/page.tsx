"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Settings } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Button } from "@/components/ui/button";
import Report from "@/components/report";
import { useState } from "react";
import { toast } from "sonner";
import Chat from "@/components/chat";
const Home = () => {
  const [reportData, setReportData] = useState<string>("");

  const onReportConfirmation = (report: string) => {
    setReportData(report);
    toast.success("Report updated");
  };
  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">GemMed AI</h1>
          <div className=" flex items-center gap-3">
            <ThemeToggle />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Settings className="size-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[80vh]">
                <DrawerHeader>
                  <DrawerTitle>Configuration</DrawerTitle>
                  <DrawerDescription>
                    Configure the settings for the model and messages.
                  </DrawerDescription>
                </DrawerHeader>
                <Report onReportConfirmation={onReportConfirmation} />
              </DrawerContent>
            </Drawer>
          </div>
        </header>
        <main className="flex-1 w-screen  flex gap-6 overflow-hidden p-4  ">
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full h-full overflow-hidden"
          >
            <ResizablePanel defaultSize={40} className="max-md:hidden ">
              <Report onReportConfirmation={onReportConfirmation} />
            </ResizablePanel>
            <ResizableHandle withHandle className="mx-2 max-md:hidden" />

            <ResizablePanel className="relative flex flex-col max-h-[calc(100vh-85px)] md:max-h-[calc(100vh-100px)] overflow-hidden p-3 bg-muted/50 rounded-xl my-2 mb-4">
              <Chat reportData={reportData} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
    </div>
  );
};

export default Home;
