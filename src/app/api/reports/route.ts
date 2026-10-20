import { NextResponse } from "next/server";

type ReportMetric = { label: string; value: string; change: string };

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Add OPENAI_API_KEY to your .env.local file to generate an AI report. See .env.example for setup." },
      { status: 503 },
    );
  }

  let body: { period?: unknown; metrics?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body.period !== "string" ||
    !["7 days", "30 days", "90 days"].includes(body.period) ||
    !Array.isArray(body.metrics) ||
    body.metrics.length === 0 ||
    body.metrics.length > 12 ||
    !body.metrics.every((metric): metric is ReportMetric =>
      typeof metric === "object" &&
      metric !== null &&
      "label" in metric && typeof metric.label === "string" && metric.label.length <= 80 &&
      "value" in metric && typeof metric.value === "string" && metric.value.length <= 40 &&
      "change" in metric && typeof metric.change === "string" && metric.change.length <= 40
    )
  ) {
    return NextResponse.json({ error: "Provide a supported reporting period and up to 12 valid metrics." }, { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: "You are a concise business analytics assistant. Analyze only the supplied metrics. Write a brief plain-text report with a short summary, two specific observations, and one practical next step. Do not invent data or present correlation as causation. Clearly note when data is limited.",
          },
          { role: "user", content: JSON.stringify({ reportingPeriod: body.period, metrics: body.metrics }) },
        ],
      }),
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the AI provider. Check your network and try again." }, { status: 502 });
  }

  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const providerMessage =
      typeof result === "object" && result !== null && "error" in result &&
      typeof result.error === "object" && result.error !== null &&
      "message" in result.error && typeof result.error.message === "string"
        ? result.error.message
        : `AI provider request failed (${response.status}).`;
    return NextResponse.json({ error: providerMessage }, { status: response.status === 429 ? 429 : 502 });
  }

  const report =
    typeof result === "object" && result !== null && "choices" in result &&
    Array.isArray(result.choices) && result.choices.length > 0 &&
    typeof result.choices[0] === "object" && result.choices[0] !== null &&
    "message" in result.choices[0] && typeof result.choices[0].message === "object" &&
    result.choices[0].message !== null && "content" in result.choices[0].message &&
    typeof result.choices[0].message.content === "string"
      ? result.choices[0].message.content.trim()
      : "";

  if (!report) {
    return NextResponse.json({ error: "The AI provider returned an empty report. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ report });
}
