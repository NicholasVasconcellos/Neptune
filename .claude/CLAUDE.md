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
