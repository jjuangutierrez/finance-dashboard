import { Responsive, WidthProvider } from "react-grid-layout/legacy";
import { WidgetPalette } from "../../widget/WidgetPalette";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveReactGridLayout = WidthProvider(Responsive) as any;

interface FinancialCanvasProps {
  portfolioId: string | null;
}

export function FinancialCanvas({ portfolioId }: FinancialCanvasProps) {
  const layouts = {
    lg: [
      { i: "balance", x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
      { i: "ingresos", x: 4, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
      { i: "egresos", x: 8, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    ],
  };

  function handleAddWidget(kind: string) {
    console.log(`Click en agregar widget '${kind}' para el portfolio ID:`, portfolioId);
    // TODO api logic
  }

  return (
  <div
    className="
      w-full
      h-full
      bg-background
      relative
      p-8
      bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)]
      dark:bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)]
      [background-size:24px_24px]
    "
  >
    <ResponsiveReactGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      isDraggable={true}
      isResizable={true}
      margin={[16, 16]}
    >
    </ResponsiveReactGridLayout>

    <WidgetPalette onAddWidget={handleAddWidget} />
  </div>
);
}