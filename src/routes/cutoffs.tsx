import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLLEGES, COMMUNITIES, type Community } from "@/lib/mock-data";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";

export const Route = createFileRoute("/cutoffs")({
  head: () => ({
    meta: [
      { title: "Cutoff Explorer — TNEA.ai" },
      { name: "description", content: "Interactive cutoff history charts across colleges, branches and communities for Tamil Nadu Engineering Admissions." },
    ],
  }),
  component: Cutoffs,
});

function Cutoffs() {
  const [collegeCode, setCollegeCode] = useState(COLLEGES[0].code);
  const college = COLLEGES.find((c) => c.code === collegeCode)!;
  const branches = useMemo(() => Array.from(new Set(college.cutoffs.map((c) => c.branch))), [college]);
  const [branch, setBranch] = useState(branches[0]);
  const [community, setCommunity] = useState<Community>("OC");

  // reset branch when college changes
  const b = branches.includes(branch) ? branch : branches[0];

  const data = useMemo(() => {
    const rows = college.cutoffs.filter((c) => c.branch === b && c.community === community);
    return rows.sort((a, z) => a.year - z.year).map((r) => ({ year: r.year, cutoff: r.cutoff }));
  }, [college, b, community]);

  return (
    <AppShell>
      <section className="container-page py-12">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Cutoff Explorer</div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Explore cutoff history</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">Visualize closing cutoffs by college, branch, community and year.</p>

        <div className="mt-10 grid md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">College</Label>
            <Select value={collegeCode} onValueChange={setCollegeCode}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COLLEGES.map((c) => <SelectItem key={c.code} value={c.code}>{c.shortName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Branch</Label>
            <Select value={b} onValueChange={setBranch}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{branches.map((br) => <SelectItem key={br} value={br}>{br}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Community</Label>
            <Select value={community} onValueChange={(v) => setCommunity(v as Community)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{COMMUNITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <Card className="mt-8 p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <LineChartIcon className="size-5 text-primary" />
            <div className="font-bold">{college.shortName} · {b} · {community}</div>
          </div>
          <div className="h-80 -ml-2">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="year" fontSize={12} />
                <YAxis domain={[150, 200]} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="cutoff" stroke="hsl(220 90% 55%)" strokeWidth={3} dot={{ r: 4 }} name="Closing cutoff" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
