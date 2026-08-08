export const COL_WIDTH = 250;
export const ROW_HEIGHT = 116;

export interface Rect {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Comprueba si dos rectángulos en la grilla se solapan
 */
export function doRectsOverlap(r1: Rect, r2: Rect): boolean {
  return (
    r1.x < r2.x + r2.w &&
    r1.x + r1.w > r2.x &&
    r1.y < r2.y + r2.h &&
    r1.y + r1.h > r2.y
  );
}

/**
 * Busca en espiral la posición libre más cercana en la grilla sin solapamientos
 */
export function findNearestFreePosition(
  targetId: string,
  startRect: Rect,
  otherRects: Rect[]
): { x: number; y: number } {
  const hasOverlap = otherRects.some(
    (other) => other.id !== targetId && doRectsOverlap(startRect, other)
  );

  if (!hasOverlap) {
    return { x: startRect.x, y: startRect.y };
  }

  for (let radius = 1; radius < 50; radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

        const candidateRect: Rect = {
          ...startRect,
          x: startRect.x + dx,
          y: startRect.y + dy,
        };

        const overlaps = otherRects.some(
          (other) => other.id !== targetId && doRectsOverlap(candidateRect, other)
        );

        if (!overlaps) {
          return { x: candidateRect.x, y: candidateRect.y };
        }
      }
    }
  }

  return { x: startRect.x, y: startRect.y };
}