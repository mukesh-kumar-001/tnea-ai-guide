import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Loader2, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ai-chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant — TNEA.ai" },
      { name: "description", content: "Chat with an AI assistant about TNEA colleges, cutoffs, placements, fees, hostels, counselling rules and seat availability." },
    ],
  }),
  component: ChatPage,
});

interface Msg { role: "user" | "assistant"; content: string; }

const STARTERS = [
  "What are the top CSE colleges in Chennai under ₹1 lakh?",
  "Explain TNEA counselling rounds and cut-off rules.",
  "Which branch has highest placement at PSG Tech?",
  "What is the difference between BC and MBC quota?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your TNEA counselling assistant. Ask me anything about colleges, cutoffs, placements, fees, hostels or counselling rules." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => { inputRef.current?.focus(); }, [loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) {
        if (res.status === 429) toast.error("Too many requests, try again in a moment.");
        else if (res.status === 402) toast.error("AI credits exhausted. Please add credits.");
        else toast.error("Assistant couldn't respond.");
        setLoading(false);
        return;
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: assistant };
          return copy;
        });
      }
    } catch (e) {
      toast.error("Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <section className="container-page py-8 max-w-4xl">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">AI Assistant</div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ask anything about TNEA</h1>

        <Card className="mt-8 rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: "60vh" }}>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[65vh]">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`grid size-8 place-items-center rounded-full shrink-0 ${m.role === "user" ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
                  {m.role === "user" ? <User className="size-4" /> : <Sparkles className="size-4" />}
                </div>
                <div className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"
                }`}>
                  {m.content || (loading && i === messages.length - 1 ? <em className="opacity-60">Thinking…</em> : "")}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="grid size-8 place-items-center rounded-full shrink-0 bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-muted text-sm rounded-tl-sm inline-flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-6 pb-4 flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-border p-4 bg-background">
            <div className="flex gap-2 items-end">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                placeholder="Ask about colleges, cutoffs, fees, hostels..."
                rows={1}
                className="resize-none rounded-xl min-h-11 max-h-40"
                disabled={loading}
              />
              <Button onClick={() => send()} disabled={loading || !input.trim()} className="rounded-xl h-11 gap-1">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
            <div className="text-[10px] text-muted-foreground mt-2 text-center">
              AI responses can be inaccurate. Verify important details with the official TNEA portal.
            </div>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
