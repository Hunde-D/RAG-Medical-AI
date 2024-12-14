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
import { Button } from "@/components/ui/button";
import Report from "@/components/report";
import { useState } from "react";
import { toast } from "sonner";
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
      </div>
    </div>
  );
};

export default Home;
