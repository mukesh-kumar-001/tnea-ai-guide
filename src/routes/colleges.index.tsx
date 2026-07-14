import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DISTRICTS, BRANCHES } from "@/lib/mock-data";
import { Search, Filter, MapPin, Building2, ArrowRight, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/colleges/")({
  head: () => ({
    meta: [
      { title: "College Explorer — TNEA.ai" },
      { name: "description", content: "Filter and browse Tamil Nadu engineering colleges by district, NAAC, NBA, branch, fees, hostel and placement." },
    ],
  }),
  component: Explorer,
});

const ALL = "all";

interface BackendCollege {
  id: number;
  tnea_code: string;
  name: string;
  district: string;
  type: string;
  autonomous: boolean;
  established_year?: number;
}

function Explorer() {
   const navigate = useNavigate(); 
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [district, setDistrict] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [naac, setNaac] = useState(ALL);
  const [nba, setNba] = useState(false);
  const [branch, setBranch] = useState(ALL);
  const [hostel, setHostel] = useState(false);
  const [maxFees, setMaxFees] = useState<[number]>([200000]);
  const [minPlacement, setMinPlacement] = useState<[number]>([0]);

  // Fetch real data from the Flask backend via the Vite proxy bridge
  useEffect(() => {
    fetch("/api/colleges/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch college database records.");
        return res.json();
      })
      .then((data) => {
        // Normalize backend data schema to match front-end interface layout requirements safely
        const normalized = (data.colleges || []).map((c: BackendCollege) => ({
          code: c.tnea_code,
          name: c.name,
          district: c.district,
          type: c.type,
          autonomous: c.autonomous,
          established: c.established_year || 1995,
          naac: "A+", // Fallback values until database tables are fully expanded
          nba: true,
          placementPercentage: 92,
          averagePackage: 6.5,
          highestPackage: 45,
          fees: 55000,
          branches: ["CSE", "ECE", "EEE", "IT", "Mech"],
          hostel: true,
        }));
        setColleges(normalized);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const results = useMemo(() => {
    return colleges.filter((c) => {
      if (q && !`${c.name} ${c.code} ${c.district}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (district !== ALL && c.district !== district) return false;
      if (type !== ALL && c.type !== type) return false;
      if (naac !== ALL && c.naac !== naac) return false;
      if (nba && !c.nba) return false;
      if (branch !== ALL && !c.branches.includes(branch)) return false;
      if (hostel && !c.hostel) return false;
      if (c.fees > maxFees[0]) return false;
      if (c.placementPercentage < minPlacement[0]) return false;
      return true;
    });
  }, [colleges, q, district, type, naac, nba, branch, hostel, maxFees, minPlacement]);

  const clearAll = () => {
    setQ(""); setDistrict(ALL); setType(ALL); setNaac(ALL); setNba(false);
    setBranch(ALL); setHostel(false); setMaxFees([200000]); setMinPlacement([0]);
  };

  return (
    <AppShell>
      <section className="border-b border-border/60 bg-surface-muted/40">
        <div className="container-page py-12">
          <div className="max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">College Explorer</div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Find the right engineering college</h1>
            <p className="mt-3 text-muted-foreground">Browse Tamil Nadu engineering colleges with rich filters and live comparison of placement, fees and accreditation.</p>
          </div>
          <div className="mt-8 relative max-w-2xl">
            <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by college name, code or city"
              className="pl-11 h-12 rounded-xl text-base"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-10 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Filters Panel */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-semibold"><Filter className="size-4" /> Filters</div>
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-7">
                <X className="size-3 mr-1" /> Clear
              </Button>
            </div>
            <div className="space-y-4">
              <FilterSelect label="District" value={district} onChange={setDistrict} options={DISTRICTS} />
              <FilterSelect label="College type" value={type} onChange={setType} options={["Government", "Aided", "Self-Financing"]} />
              <FilterSelect label="NAAC Grade" value={naac} onChange={setNaac} options={["A++", "A+", "A", "B++", "B+", "B"]} />
              <FilterSelect label="Branch" value={branch} onChange={setBranch} options={BRANCHES} />

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Annual Fees</Label>
                <Slider min={20000} max={200000} step={5000} value={maxFees} onValueChange={(v) => setMaxFees(v as [number])} className="mt-3" />
                <div className="mt-2 text-sm font-medium">₹{maxFees[0].toLocaleString("en-IN")}</div>
              </div>
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Placement %</Label>
                <Slider min={0} max={100} step={5} value={minPlacement} onValueChange={(v) => setMinPlacement(v as [number])} className="mt-3" />
                <div className="mt-2 text-sm font-medium">{minPlacement[0]}%</div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="nba" className="text-sm">NBA Accredited</Label>
                <Switch id="nba" checked={nba} onCheckedChange={setNba} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hostel" className="text-sm">Hostel Available</Label>
                <Switch id="hostel" checked={hostel} onCheckedChange={setHostel} />
              </div>
            </div>
          </Card>
        </aside>

        {/* Dynamic Content Stream */}
        <div>
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 text-muted-foreground gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm">Querying local SQLite TNEA records...</p>
            </div>
          ) : error ? (
            <Card className="p-10 rounded-2xl text-center border-destructive/40 bg-destructive/5">
              <div className="text-destructive font-medium">Error linking to Flask API</div>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-5">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{results.length}</span> of {colleges.length} database entries
                </div>
              </div>

              {results.length === 0 ? (
                <Card className="p-10 rounded-2xl text-center">
                  <div className="text-muted-foreground">No colleges match your active search filters.</div>
                  <Button variant="outline" size="sm" onClick={clearAll} className="mt-4">Reset filters</Button>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {results.map((c) => (
                    <Card key={c.code} className="p-6 rounded-2xl hover:shadow-elegant transition-shadow border-border/60">
                      <div className="flex flex-col md:flex-row md:items-start gap-5">
                        <div className="grid size-14 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                          <Building2 className="size-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <Badge variant="secondary" className="font-mono">Code {c.code}</Badge>
                            <Badge variant="outline">{c.type}</Badge>
                            <Badge className="bg-success/15 text-success hover:bg-success/15 border-0">NAAC {c.naac}</Badge>
                            {c.autonomous && <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Autonomous</Badge>}
                          </div>
                          <h3 className="text-lg md:text-xl font-bold leading-tight">{c.name}</h3>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                            <MapPin className="size-3.5" /> {c.district}, Tamil Nadu · Est. {c.established}
                          </div>

                          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border/60 pt-4">
  <Stat label="Placement" value={`${c.placementPercentage}%`} />
  <Stat label="Avg Package" value={`₹${c.averagePackage} LPA`} />
  <Stat label="Highest" value={`₹${c.highestPackage} LPA`} />
  <Stat label="Fees / Yr" value={`₹${(c.fees / 1000).toFixed(0)}k`} />
</div>

                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {c.branches.slice(0, 4).map((b: string) => (
                              <Badge key={b} variant="secondary" className="font-normal">{b}</Badge>
                            ))}
                            {c.branches.length > 4 && <Badge variant="outline">+{c.branches.length - 4} more</Badge>}
                          </div>
                        </div>
                        <Link
  to="/colleges/$code"
  params={{ code: c.code }}
>
  <Button className="rounded-xl gap-1 shrink-0">
    Details <ArrowRight className="size-3.5" />
  </Button>
</Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Any</SelectItem>
          {options.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-bold mt-0.5">{value}</div>
    </div>
  );
}
