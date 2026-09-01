import type { WidgetKind } from "@/features/widget/types/widget.types";

interface SizeConstraint {
  minWidth: number;
  minHeight: number;
}

/**
 * Minimum resize dimensions per widget kind.
 *
 * Each widget's layout density is different (a compact saving-goal card
 * needs less vertical room than a summary widget with multiple widget
 * breakdowns), so this is intentionally per-kind instead of one global
 * constraint in WidgetNode.
 *
 * When adding a new WidgetKind, add its entry here too — DEFAULT_SIZE_CONSTRAINT
 * is only a safety net, not a substitute for tuning the real minimum.
 */
export const WIDGET_SIZE_CONSTRAINTS: Record<WidgetKind, SizeConstraint> = {
  tracker: { minWidth: 380, minHeight: 500},
  savinggoal: { minWidth: 380, minHeight: 500 },
  recurringexpense: { minWidth: 380, minHeight: 500 },
  summary: { minWidth: 420, minHeight: 220 },
};

const DEFAULT_SIZE_CONSTRAINT: SizeConstraint = { minWidth: 320, minHeight: 180 };

export function getWidgetSizeConstraint(kind: WidgetKind): SizeConstraint {
  return WIDGET_SIZE_CONSTRAINTS[kind] ?? DEFAULT_SIZE_CONSTRAINT;
}

/**
 * Converts a widget kind's pixel-based minimum (used directly by NodeResizer)
 * into a minimum grid-cell size (used by the canvas's persistence/collision
 * layer). Always rounds UP (Math.ceil) — this is deliberate: rounding to the
 * nearest cell (Math.round) can produce a grid size whose pixel equivalent is
 * SMALLER than the widget's real pixel minimum, which then causes NodeResizer
 * to immediately snap the widget back up on the next render (a visible jump
 * right at the size limit). Ceil guarantees:
 *
 *   gridW * colWidth - gap >= minWidth   (always true, never violated)
 *
 * so the grid-persisted size and NodeResizer's own minWidth/minHeight can
 * never disagree. Keep this as the single source of truth for both
 * WidgetNode (pixel side) and the canvas (grid side) instead of
 * recalculating minimums independently in each file.
 */
export function getMinGridSize(
  kind: WidgetKind | undefined,
  colWidth: number,
  rowHeight: number,
  gap: number = 16,
): { minGridW: number; minGridH: number } {
  const { minWidth, minHeight } = kind
    ? getWidgetSizeConstraint(kind)
    : DEFAULT_SIZE_CONSTRAINT;

  return {
    minGridW: Math.max(1, Math.ceil((minWidth + gap) / colWidth)),
    minGridH: Math.max(1, Math.ceil((minHeight + gap) / rowHeight)),
  };
}