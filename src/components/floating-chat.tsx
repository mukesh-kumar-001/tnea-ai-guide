import { useState } from "react";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 max-w-[calc(100vw-3rem)] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-fade-up">
          <div className="bg-primary text-primary-foreground p-4 flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold">TNEA Counselling Assistant</div>
              <div className="text-xs opacity-80 mt-0.5">AI-powered · Online</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="opacity-80 hover:opacity-100">
              <X className="size-4" />
            </button>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            <div className="rounded-2xl rounded-tl-sm bg-muted p-3 text-sm max-w-[85%]">
              Hi! I can answer questions about colleges, cutoffs, branches, fees, hostels and counselling rules. What's your TNEA cutoff mark?
            </div>
            <div className="text-xs text-muted-foreground text-center pt-2">
              Open the full assistant for chat history and richer answers.
            </div>
          </div>
          <div className="p-3 border-t border-border">
            <Link to="/ai-chat" onClick={() => setOpen(false)}>
              <Button className="w-full rounded-xl" size="sm">
                Open AI Assistant <ArrowRight className="size-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow hover:scale-105 transition-transform"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="size-6" />
      </button>
    </div>
  );
}
