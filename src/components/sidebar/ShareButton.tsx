import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";

export function ShareButton() {
  const { handleShare } = useApp();

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className="w-full cursor-pointer"
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share Preview
    </Button>
  );
}

