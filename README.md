# Insightly AI

A Next.js and TypeScript analytics demo with interactive charts, CSV export, and a server-side OpenAI integration. Select a reporting period to explore sample business metrics, export them, or generate a plain-text report.

## How reports work

1. The dashboard sends the selected period and KPI values to `POST /api/reports`.
2. The [server route](src/app/api/reports/route.ts) validates the reporting period and metric fields before calling OpenAI.
3. The server reads the API key from its environment and returns the report or an error. The route handles provider rate limits, failed requests, and empty reports.

## Run locally

```bash
git clone https://github.com/Kylin-Ace/insightly-ai.git
cd insightly-ai
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Charts, reporting-period filters, and CSV export work with bundled sample data.

To enable AI reports, copy [`.env.example`](.env.example) to `.env.local`, set `OPENAI_API_KEY`, and restart the dev server. You can set `OPENAI_MODEL` to override the default model. Keep `.env.local` out of version control.
