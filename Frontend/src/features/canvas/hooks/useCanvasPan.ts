import { useEffect, useRef } from "react";
import { useReactFlow } from "@xyflow/react";

/**
 * Hook para arrastrar el lienzo de React Flow con Click Derecho
 * desde cualquier parte de la pantalla (incluso sobre widgets).
 */
export function useCanvasRightClickPan() {
  const { getViewport, setViewport } = useReactFlow();
  const isPanningRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startViewportRef = useRef({ x: 0, y: 0, zoom: 1 });

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (e.button !== 2) return; // Solo activa con Click Derecho
      e.preventDefault();

      isPanningRef.current = true;
      startPosRef.current = { x: e.clientX, y: e.clientY };
      startViewportRef.current = getViewport();
    }

    function handleMouseMove(e: MouseEvent) {
      if (!isPanningRef.current) return;

      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;

      setViewport({
        x: startViewportRef.current.x + dx,
        y: startViewportRef.current.y + dy,
        zoom: startViewportRef.current.zoom,
      });
    }

    function handleMouseUp(e: MouseEvent) {
      if (e.button === 2) {
        isPanningRef.current = false;
      }
    }

    function handleContextMenu(e: MouseEvent) {
      e.preventDefault(); // Bloquea el menú del navegador
    }

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu, { capture: true });

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
    };
  }, [getViewport, setViewport]);
}