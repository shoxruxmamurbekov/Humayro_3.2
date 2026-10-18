# HUMAYRO_3.2 — project skeleton and API request flow

This guide is for understanding the folders and the path a request follows. You can read it without adding real API keys or paying for any provider.

## Folder map

```text
Humayro_3.2/
├── src/                         # Browser/frontend application
│   ├── components/              # UI pieces: panels, modals, cards, sections
│   ├── services/                # Frontend API clients and data hooks
│   │   ├── api.ts               # AI analysis/article + Admin AI settings requests
│   │   ├── newsroomApi.ts       # Newsroom-specific requests
│   │   └── useLiveIntelligence.ts # Hook that refreshes intelligence data
│   ├── data/                    # Static/local region and globe data
│   ├── i18n/                    # Translations
│   └── types/                   # Shared frontend TypeScript types
├── server.ts                    # Local Express server and /api routes
├── netlify/functions/api.ts     # Serverless version of the API for Netlify
├── server/                      # Backend logic (not browser UI)
│   ├── aiService.ts             # Builds prompts and normalizes AI results
│   ├── aiProviderManager.ts     # Provider credentials, settings, and HTTP/SDK calls
│   ├── aiValidation.ts          # Validates AI output
│   ├── newsService.ts           # Fetches news/RSS context
│   ├── rateLimit.ts              # Request throttling
│   ├── security.ts               # Admin auth/security helpers
│   └── *Service.ts               # Other backend business logic
├── docs/                        # Developer documentation
└── .env.example                 # Names of environment variables; placeholders only
```

## Example: frontend calls backend

The frontend should call its own backend route rather than calling a secret-key API directly from a browser component.

```ts
// src/services/api.ts (simplified illustration)
export async function askHumayro(query: string) {
  const response = await fetch('/api/ai/synthesize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, lang: 'uz' })
  });

  if (!response.ok) {
    throw new Error('HUMAYRO API request failed');
  }

  return response.json();
}
```

What happens next:

1. `src/components/SearchSection.tsx` or another UI component calls a frontend service function.
2. `src/services/api.ts` sends an HTTP request to `/api/ai/synthesize`.
3. `server.ts` handles the route during local development; `netlify/functions/api.ts` handles it on Netlify.
4. The route validates input and applies rate-limit/quota checks.
5. The handler calls `server/aiService.ts`, which collects context and builds the AI prompt.
6. `server/aiProviderManager.ts` sends the request to the selected provider.
7. The response returns through the same path to the UI.

## Example: provider HTTP request (simplified)

The actual provider manager implements the adapters. This small example illustrates the shape of a request; do not paste a real key into frontend code.

```ts
// Backend-only illustration — never place this in src/components or other browser code.
const response = await fetch(
  'https://api.groq.com/openai/v1/chat/completions',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL_GROQ || 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Return a short JSON summary.' }],
      response_format: { type: 'json_object' }
    })
  }
);
```

The provider adapter returns text to `aiService.ts`; `aiService.ts` validates/normalizes the answer and the API route returns JSON to the frontend.

## How to explore it

- Start at `src/components/SearchSection.tsx` to understand the UI event.
- Find `synthesizeAiQuery` in `src/services/api.ts` to see the browser-to-backend request.
- Find `/api/ai/synthesize` in `server.ts` and `netlify/functions/api.ts` to compare local and deployed routing.
- Read `synthesizeNews` in `server/aiService.ts` to see prompt construction and response handling.
- Read `generateAiJsonResponses` and `requestProvider` in `server/aiProviderManager.ts` to see provider selection and the actual API request code.

## API keys and costs

- No provider key is required to read this guide or understand the file structure.
- Real cloud AI calls require a valid key for at least one provider.
- Keep keys in server environment variables or the protected Admin AI Provider Manager; never hardcode them in React code or commit them to Git.
- A mocked unit test can verify request URLs, headers, and payload shape without contacting the provider or using a real API key.
- Provider model names, quotas, and pricing can change. Check the selected provider's own dashboard.
