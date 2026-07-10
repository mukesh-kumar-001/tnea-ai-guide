import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { COMMUNITIES, type Community } from "@/lib/mock-data";
import { TrendingUp, Sparkles } from "lucide-react";

export const Route = createFileRoute("/rank-predictor")({
  head: () => ({
    meta: [
      { title: "Rank Predictor — TNEA.ai" },
      { name: "description", content: "Estimate your TNEA general and community rank instantly from your cutoff marks with confidence indicator." },
    ],
  }),
  component: RankPredictor,
});

// mock model: rank scales inversely with cutoff, community-adjusted
function predict(cutoff: number, community: Community) {
  const c = Math.max(100, Math.min(200, cutoff));
  const general = Math.round(Math.max(1, (200 - c) * 950 + 200));
  const commAdj: Record<Community, number> = { OC: 1, BC: 0.75, BCM: 0.6, MBC: 0.5, SC: 0.25, SCA: 0.2, ST: 0.15 };
  const community_rank = Math.round(general * commAdj[community]);
  const spread = Math.round(general * 0.08);
  const confidence = Math.max(65, Math.min(98, Math.round(60 + (c - 100) * 0.4)));
  return {
    general: [Math.max(1, general - spread), general + spread] as [number, number],
    community: [Math.max(1, community_rank - Math.round(spread * commAdj[community])), community_rank + Math.round(spread * commAdj[community])] as [number, number],
    confidence,
  };
}

function RankPredictor() {
  const [cutoff, setCutoff] = useState("190");
  const [community, setCommunity] = useState<Community>("BC");
  const [result, setResult] = useState<ReturnType<typeof predict> | null>(null);

  const submit = () => {
    const c = parseFloat(cutoff);
    if (isNaN(c) || c < 100 || c > 200) return;
    setResult(predict(c, community));
  };

  return (
    <AppShell>
      <section className="container-page py-12 max-w-4xl">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Rank Predictor</div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Estimate your TNEA rank</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Enter your cutoff (out of 200) and community to see an estimated general and community rank based on 10-year trends.</p>

        <div className="mt-10 grid md:grid-cols-[1fr_1.2fr] gap-6">
          <Card className="p-6 rounded-2xl">
            <div className="space-y-5">
              <div>
                <Label htmlFor="cutoff">Cutoff Marks (out of 200)</Label>
                <Input id="cutoff" type="number" step="0.5" min="100" max="200" value={cutoff}
                  onChange={(e) => setCutoff(e.target.value)} className="mt-1.5 text-lg font-semibold" />
              </div>
              <div>
                <Label>Community</Label>
                <Select value={community} onValueChange={(v) => setCommunity(v as Community)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {COMMUNITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={submit} className="w-full rounded-xl gap-2 h-11">
                <TrendingUp className="size-4" /> Predict Rank
              </Button>
            </div>
          </Card>

          <Card className={`p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border-primary/20 ${result ? "" : "opacity-70"}`}>
            <div className="flex items-center gap-2 text-primary font-bold mb-4">
              <Sparkles className="size-5" /> Predicted Rank
            </div>
            {result ? (
              <div className="space-y-6">
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Estimated General Rank</div>
                  <div className="text-3xl md:text-4xl font-extrabold mt-1">{result.general[0].toLocaleString()} – {result.general[1].toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Estimated {community} Rank</div>
                  <div className="text-2xl md:text-3xl font-extrabold mt-1">{result.community[0].toLocaleString()} – {result.community[1].toLocaleString()}</div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Confidence</span>
                    <span className="text-sm font-bold">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Estimates are based on historical trends and do not guarantee actual TNEA rank. Official rank is published by DoTE.
                </p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Enter your details and press "Predict Rank" to see the estimate.</div>
            )}
          </Card>
        </div>
      </section>
    </AppShell>
  );
}
