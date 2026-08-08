import { useReactFlow } from "@xyflow/react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CanvasZoomControls() {
  const { zoomIn, zoomOut, setViewport, getViewport } = useReactFlow();
  const { zoom } = getViewport();
  const zoomPercentage = Math.round((zoom || 1) * 100);

  const handleReset = () => {
    const current = getViewport();
    setViewport({ ...current, zoom: 1 });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-1 p-1 bg-card/90 backdrop-blur border shadow-lg rounded-xl text-xs select-none">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => zoomOut()}
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2.5 text-xs font-mono font-medium text-muted-foreground hover:text-foreground cursor-pointer min-w-[52px]"
        onClick={handleReset}
        title="Reset Zoom (100%)"
      >
        {zoomPercentage}%
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={() => zoomIn()}
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
}