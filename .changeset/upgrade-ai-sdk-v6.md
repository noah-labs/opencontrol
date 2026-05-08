---
"opencontrol": patch
---

Upgrade `ai` to v6 (`6.0.175`) and `zod` to `3.25.76`. Migrate from
`LanguageModelV1` to `LanguageModelV3` (now imported from
`@ai-sdk/provider`). Updates the `/generate` request/response shapes
and tool-call/tool-result content parts to the v3 protocol
(`input`/`output` instead of `args`/`result`, `providerOptions` instead
of `providerMetadata`, structured `finishReason`).
