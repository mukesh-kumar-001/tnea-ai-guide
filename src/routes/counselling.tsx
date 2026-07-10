import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Loader2, ChevronRight, Trophy, Target, Shield } from "lucide-react";
import { COMMUNITIES, DISTRICTS, BRANCHES, COLLEGES, type Community } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/counselling")({
  head: () => ({
    meta: [
      { title: "AI Counselling — TNEA.ai" },
      { name: "description", content: "AI-generated dream, target and safe college recommendations for TNEA based on your rank, community and preferences." },
    ],
  }),
  component: Counselling;
});

interface Reco {
  code: string;
  name: string;
  branch: string;
  probability: number;
  expectedCutoff: number;
  reasoning: string;
  category: "dream" | "target" | "safe";
}

function Counselling() {
  const [community, setCommunity] = useState<Community>("BC");
  const [gender, setGender] = useState("Female");
  const [genRank, setGenRank] = useState("2500");
  const [commRank, setCommRank] = useState("1400");
  const [cutoff, setCutoff] = useState("192.5");
  const [prefBranches, setPrefBranches] = useState<string[]>(["Computer Science and Engineering", "Information Technology"]);
  const [prefDistricts, setPrefDistricts] = useState<string[]>(["Chennai", "Coimbatore"]);
  const [budget, setBudget] = useState<[number]>([150000]);
  const [hostel, setHostel] = useState(true);

  const [loading, setLoading] = useState(false);
  const [recos, setRecos] = useState<Reco[] | null>(null);

  const generate = async () => {
    setLoading(true);
    setRecos(null);
    try {
      // Local heuristic recommendations (offline). AI reasoning fetched from API.
      const scored = COLLEGES.flatMap((c) => {
        return c.branches
          .filter((b) => prefBranches.length === 0 || prefBranches.includes(b))
          .map((b) => {
            const cutoffRow = c.cutoffs.find((x) => x.branch === b && x.community === community && x.year === 2024)
                          ?? c.cutoffs.find((x) => x.branch === b && x.community === community);
            const expectedCutoff = cutoffRow?.cutoff ?? 180;
            const districtMatch = prefDistricts.length === 0 || prefDistricts.includes(c.district) ? 1 : 0.85;
            const budgetOk = c.fees <= budget[0] ? 1 : 0.7;
            const hostelOk = !hostel || c.hostel ? 1 : 0.3;
            const diff = parseFloat(cutoff) - expectedCutoff;
            // probability
            let probability = 50 + diff * 8;
            probability = Math.max(3, Math.min(97, probability)) * districtMatch * budgetOk * hostelOk;
            probability = Math.round(probability);
            let category: Reco["category"];
            if (probability >= 70) category = "safe";
            else if (probability >= 35) category = "target";
            else category = "dream";
            return {
              code: c.code,
              name: c.shortName,
              branch: b,
              probability,
              expectedCutoff,
              reasoning: "",
              category,
            } as Reco;
          });
      })
        .sort((a, z) => z.probability - a.probability)
        .slice(0, 12);

      // Fetch AI reasoning
      try {
        const res = await fetch("/api/counselling", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: { community, gender, genRank, commRank, cutoff, prefBranches, prefDistricts, budget: budget[0], hostel },
            picks: scored.map((s) => ({ code: s.code, name: s.name, branch: s.branch, probability: s.probability, expectedCutoff: s.expectedCutoff })),
          }),
        });
        if (res.ok) {
          const data = await res.json() as { reasonings: Record<string, string> };
          scored.forEach((r) => {
            const key = `${r.code}-${r.branch}`;
            if (data.reasonings[key]) r.reasoning = data.reasonings[key];
          });
        }
      } catch (e) {
        console.warn("AI reasoning failed", e);
      }

      setRecos(scored);
    } catch (e) {
      toast.error("Could not generate recommendations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFrom = (arr: string[], v: string) => arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const groups = recos ? {
    dream: recos.filter((r) => r.category === "dream").slice(0, 5),
    target: recos.filter((r) => r.category === "target").slice(0, 5),
    safe: recos.filter((r) => r.category === "safe").slice(0, 5),
  } : null;

  return (
    <AppShell>
      <section className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">AI Counselling</div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Get personalized college recommendations</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Share your TNEA details and preferences. Our AI generates dream, target and safe college lists with reasoning.</p>

        <div className="mt-10 grid lg:grid-cols-[380px_1fr] gap-8">
          <Card className="p-6 rounded-2xl h-fit lg:sticky lg:top-20">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Community</Label>
                  <Select value={community} onValueChange={(v) => setCommunity(v as Community)}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{COMMUNITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>General Rank</Label><Input value={genRank} onChange={(e) => setGenRank(e.target.value)} className="mt-1.5" /></div>
                <div><Label>Community Rank</Label><Input value={commRank} onChange={(e) => setCommRank(e.target.value)} className="mt-1.5" /></div>
              </div>
              <div><Label>Cutoff (out of 200)</Label><Input value={cutoff} onChange={(e) => setCutoff(e.target.value)} className="mt-1.5" /></div>

              <div>
                <Label>Preferred Branches</Label>
                <div className="mt-2 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                  {BRANCHES.map((b) => (
                    <Badge key={b} onClick={() => setPrefBranches(toggleFrom(prefBranches, b))}
                      variant={prefBranches.includes(b) ? "default" : "outline"}
                      className="cursor-pointer text-[11px] font-normal">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred Districts</Label>
                <div className="mt-2 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {DISTRICTS.map((d) => (
                    <Badge key={d} onClick={() => setPrefDistricts(toggleFrom(prefDistricts, d))}
                      variant={prefDistricts.includes(d) ? "default" : "outline"}
                      className="cursor-pointer text-[11px] font-normal">
                      {d}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Annual Budget: ₹{budget[0].toLocaleString("en-IN")}</Label>
                <Slider min={20000} max={200000} step={5000} value={budget} onValueChange={(v) => setBudget(v as [number])} className="mt-3" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hostel-req">Hostel Required</Label>
                <Switch id="hostel-req" checked={hostel} onCheckedChange={setHostel} />
              </div>

              <Button onClick={generate} disabled={loading} className="w-full h-11 rounded-xl gap-2">
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {loading ? "Generating..." : "Generate Recommendations"}
              </Button>
            </div>
          </Card>

          <div>
            {!recos && !loading && (
              <Card className="p-10 rounded-2xl text-center border-dashed">
                <Sparkles className="size-8 mx-auto text-primary mb-3" />
                <div className="font-bold">Fill in your details</div>
                <p className="text-sm text-muted-foreground mt-1">Your AI-powered college recommendations will appear here.</p>
              </Card>
            )}
            {loading && (
              <Card className="p-10 rounded-2xl text-center">
                <Loader2 className="size-8 mx-auto text-primary animate-spin mb-3" />
                <div className="font-bold">Analysing your profile...</div>
                <p className="text-sm text-muted-foreground mt-1">Matching against verified cutoffs and preferences.</p>
              </Card>
            )}
            {groups && (
              <div className="space-y-8">
                <Group icon={Trophy} title="Dream Colleges" description="Stretch goals — high value if you get in" list={groups.dream} tone="warning" />
                <Group icon={Target} title="Target Colleges" description="Realistic fits at your rank" list={groups.target} tone="primary" />
                <Group icon={Shield} title="Safe Colleges" description="Very likely admissions — good backups" list={groups.safe} tone="success" />
              </div>
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Group({ icon: Icon, title, description, list, tone }: {
  icon: any; title: string; description: string; list: Reco[]; tone: "warning" | "primary" | "success";
}) {
  if (list.length === 0) return null;
  const toneClass = tone === "warning" ? "text-warning bg-warning/10"
    : tone === "success" ? "text-success bg-success/10"
    : "text-primary bg-primary/10";
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`grid size-10 place-items-center rounded-xl ${toneClass}`}><Icon className="size-5" /></div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="grid gap-3">
        {list.map((r) => (
          <Card key={`${r.code}-${r.branch}`} className="p-5 rounded-xl hover:shadow-elegant transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Code {r.code}</span>
                  <span className="font-bold">{r.name}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">{r.branch}</div>
                {r.reasoning && <p className="text-sm mt-2 leading-relaxed">{r.reasoning}</p>}
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  <span className="text-muted-foreground">Expected cutoff: <strong className="text-foreground font-mono">{r.expectedCutoff.toFixed(1)}</strong></span>
                  <span className="text-muted-foreground">Admission probability: <strong className={toneClass.split(" ")[0]}>{r.probability}%</strong></span>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
