# Insightly AI

A responsive analytics dashboard built with Next.js, React, TypeScript, and Tailwind CSS. Explore sample revenue, customer, conversion, product, and traffic metrics; switch reporting periods; export KPI data to CSV; and generate a business-performance report with the OpenAI API.

## Run locally

```bash
npm install
```

Copy `.env.example` to `.env.local`, add your OpenAI API key, and start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The dashboard data is sample data for demonstration. AI report generation requires a valid OpenAI API key. The key is read on the server and must never be exposed in client-side code.

## GitHub

This folder is a standalone repository. Create an empty GitHub repository, then run these commands from this directory:

```bash
git init
git add .
git commit -m "Build Insightly AI analytics dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/insightly-ai.git
git push -u origin main
```

Do not commit `.env.local` or API keys.
