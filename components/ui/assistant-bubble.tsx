"use client";

import { useEffect, useRef, useState } from "react";
import { askAssistant } from "@/lib/api";
import { X, Send, MessageSquare } from "lucide-react";

type Props = { ctx?: any };

export function AssistantBubble({ ctx }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const booted = useRef(false);

  // First open → auto intro
  useEffect(() => {
    if (open && !booted.current) {
      booted.current = true;
      handleAsk("What can you do on this site?");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleAsk(message?: string) {
    const m = (message ?? input).trim();
    if (!m) return;
    setInput("");
    setMsgs((s) => [...s, { role: "user", text: m }]);
    try {
      setLoading(true);
      const res = await askAssistant({ message: m, context: ctx });
      setMsgs((s) => [...s, { role: "ai", text: res.text || "…" }]);
    } catch (e: any) {
      setMsgs((s) => [...s, { role: "ai", text: "Sorry—something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 shadow-xl flex items-center gap-2"
        aria-label="AI Assistant"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="hidden sm:inline">AI Assistant</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[92vw] max-w-md rounded-xl border bg-background shadow-2xl">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="font-semibold">AI Assistant</div>
            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[50vh] overflow-auto p-3 space-y-3">
            {msgs.length === 0 && (
              <div className="text-sm text-muted-foreground">
                I can explain this dashboard (prices, z-score, joint distribution, rolling correlation, backtest) and suggest
                promising stock pairs. Ask anything—answers stay brief (50–100 words).
              </div>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed px-3 py-2 rounded-md ${
                  m.role === "user" ? "bg-emerald-50 border border-emerald-200 ml-8" : "bg-muted mr-8"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <div className="text-xs text-muted-foreground">Thinking…</div>}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Ask about tools or good pairs…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading || !input.trim()}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-sm disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
