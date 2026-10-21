# Project rules
- Keep the existing `_app` pathless layout as the client-only account gate; verify the user and onboarding before rendering children, since account sessions are browser-held.
- Use a single root auth transition subscriber and shared account queries; sign-out cancels and clears all cached account data before navigating.
- Keep study validation in a browser-safe module and authenticated writes in server functions; exercise lists must pass exact-count, option, duplicate and semantic-review checks before use.
- Keep server-only AI helpers outside the client graph; call streamed Responses with instructions rather than system messages on AI SDK 7.
- Derive student statistics from owner-scoped exercise attempts, never mock data; new accounts must display empty progress.
