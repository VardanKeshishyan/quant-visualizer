import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const payload = {
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.4,
      max_tokens: 220,
      messages: [
        {
          role: "system",
          content:
            "You are a concise assistant for a pairs-trading analytics site. Reply in 50–100 words. Explain the dashboard purpose and tools (price, z-score, joint distribution, rolling correlation, backtest). Suggest potentially good stock pairs from context. Be neutral; no financial advice.",
        },
        ...(context ? [{ role: "user", content: `Context: ${JSON.stringify(context).slice(0, 1600)}` }] : []),
        { role: "user", content: message || "What can you do here?" },
      ],
    };

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return NextResponse.json({ error: `Groq error ${resp.status}: ${t}` }, { status: 500 });
    }

    const json = await resp.json();
    const text = json?.choices?.[0]?.message?.content || "";
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "assistant_error" }, { status: 500 });
  }
}
