import { HelpCircle, Share2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { ConnectUxMode } from "@/types";

type PreviewHeaderProps = {
  connectUxMode: ConnectUxMode;
  onShare: () => void;
};

export function PreviewHeader({ connectUxMode, onShare }: PreviewHeaderProps) {
  return (
    <header className="flex justify-end px-4 sm:px-8 py-4 shrink-0">
      <div className="flex items-center gap-1">
        <Tooltip content="Click to copy a link to this preview with your current configuration">
          <button
            onClick={onShare}
            className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
          >
            <Share2 className="h-5 w-5 text-muted-foreground" />
          </button>
        </Tooltip>
        <Tooltip
          content={
            connectUxMode === "widget"
              ? "Use the sidebar to customize the Aurum widget and preview your branded experience"
              : connectUxMode === "headless"
              ? "Test headless API with direct wallet connections and email authentication"
              : "Use the sidebar to customize the wallet connection modal and preview your branded experience"
          }
        >
          <button className="p-2 rounded-full hover:bg-muted transition-colors cursor-pointer">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </button>
        </Tooltip>
      </div>
    </header>
  );
}
