## UI System

Follow the design principles and component conventions in `.claude/skill.md`.
All new screens MUST use the shared component library (`components/ui/`) and
semantic color tokens — never hardcode colors or rebuild existing components.

## Context7 Usage

Always use the Context7 MCP tools (`resolve-library-id` and `query-docs`) before
implementing code for external libraries like React Native, Expo, NativeWind to ensure
you are using the latest API patterns.

## Summarization

Explain in consise and plain terms. Be extremely consise only list relevant information. Sacrifice grammer for the sake of concision.

## Testing

### Unit / Integration Tests

- Run existing tests before and after implementing a feature. Do not merge if tests fail.
- Add tests for new logic when applicable.

### iOS Simulator UI Testing

- **When:** After implementing any UI-facing feature or fixing a UI bug.
- **Tool:** `ios-simulator-skill` (`~/.claude/skills/ios-simulator-skill`).
- **Workflow:**
  1. Build and install the app on the booted simulator.
  2. Navigate to the affected screens using tap/swipe commands.
  3. Screenshot and view **every distinct state** (empty, loaded, error, edge cases).
  4. Visually verify: correct layout, no clipping, text readable, interactive elements visible.
- Do not skip verification for "minor" changes — if it touches UI, test it.
- Do not consider a UI feature complete until screenshots confirm correctness.
