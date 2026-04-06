# Fix ButtonGrid Alignment

## Context
On the View Data screen, the ButtonGrid icons and text appear misaligned. Different FontAwesome icons have different glyph dimensions, causing inconsistent vertical positioning.

## Changes — `components/ButtonGrid.tsx`

1. **Wrap icon in fixed-height View** (`h-8 items-center justify-center`) so all icons align regardless of glyph shape
2. **Reorder to icon-on-top, label below** — more standard for grid tiles
3. **Add `numberOfLines={1}`** to Text to enforce single-line labels

## Verification
- Run `npx expo start`, open View Data tab
- Confirm icons are vertically aligned across all 3 boxes
- Confirm text is centered, single-line, below each icon
- Confirm selected state (border + color) still works
