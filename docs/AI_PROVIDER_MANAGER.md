# HUMAYRO AI Provider Manager

This document explains how the provider API calls flow through HUMAYRO_3.2 and how to configure them.

## Request flow

1. The React UI calls `POST /api/ai/synthesize` for conversational analysis or `POST /api/ai/article` for a long-form article.
2. The serverless Express API validates the request, applies rate limits and the user's quota, then calls `synthesizeNews()` or `generateArticle()`.
3. The AI service gathers live RSS/news context and builds a structured JSON prompt.
4. `generateAiJsonResponses()` loads the configured provider, resolves credentials, and makes the provider API request.
5. If the selected primary provider fails, HUMAYRO tries the configured AI fallback provider, if one is selected. If no AI response is available, the existing RSS-based fallback is returned.
6. The frontend receives the normalized result through the existing API client.

## Supported providers

| Provider | Environment key | Default endpoint |
| --- | --- | --- |
| Google Gemini | `GEMINI_API_KEY` | Google GenAI SDK `models.generateContent` |
| Groq | `GROQ_API_KEY` | `https://api.groq.com/openai/v1/chat/completions` |
| OpenRouter | `OPENROUTER_API_KEY` | `https://openrouter.ai/api/v1/chat/completions` |

Optional environment settings:

- `AI_PROVIDER=gemini`
- `FALLBACK_AI_PROVIDER=groq` (or `openrouter` / `rss-fallback`)
- `AI_MODEL_GEMINI`, `AI_MODEL_GROQ`, `AI_MODEL_OPENROUTER`
- `APP_URL` for OpenRouter's optional `HTTP-Referer` header
- `AI_SETTINGS_ENCRYPTION_KEY` for securely saving keys entered in the Admin UI

At least one working provider API key is required for cloud AI. A local environment can use `.env`, which must not be committed to Git.

## Admin UI setup

1. Configure `ADMIN_SECRET` in the deployment environment and log in to Admin Console.
2. For UI-managed keys, add a stable random `AI_SETTINGS_ENCRYPTION_KEY` value of at least 32 characters in the hosting environment. Generate one locally with `openssl rand -hex 32`.
3. Open **AI Provider Manager**, enter the provider API key and model ID, then choose **Ulanishni tekshirish**.
4. After a successful test, choose the primary and fallback providers and press **Sozlamalarni saqlash**.
5. Saved keys are encrypted server-side with AES-256-GCM, are not written to browser localStorage, and are never returned in API responses. On Netlify the encrypted settings are stored in Netlify Blobs.

Keep the encryption key stable. Rotating it means previously stored provider keys cannot be decrypted. Re-enter those keys if you rotate the encryption secret.

## Admin API endpoints

All Admin endpoints require the `x-admin-token` header with the configured `ADMIN_SECRET`.

- `GET /api/admin/ai-settings` — safe status summary; never returns keys.
- `PUT /api/admin/ai-settings` — save provider preferences, model IDs, or encrypted keys.
- `POST /api/admin/ai-settings/test` — sends a minimal JSON-mode request to the selected provider without persisting a draft key.
- `GET /api/admin/metrics` — existing operational metrics.

Example test request (do not put real API keys in shell history if avoidable):

```bash
curl -X POST "$APP_URL/api/admin/ai-settings/test" \
  -H "Content-Type: application/json" \
  -H "x-admin-token: $ADMIN_SECRET" \
  -d '{"provider":"groq","model":"llama-3.3-70b-versatile"}'
```

## Validation and cost notes

The connection test checks whether the selected provider accepts a request and returns a non-empty response. It does not verify billing or guarantee a model's ongoing availability. Provider model IDs and access limits can change, so select a model enabled in the matching provider account. Groq and OpenRouter use an OpenAI-compatible chat-completions request with JSON response mode; Gemini uses the Google GenAI SDK's JSON response mode.

HUMAYRO does not invent cross-provider billing totals. Check actual token usage and charges in each provider's own dashboard.
