import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { findCollege, type College } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Building2, MapPin, Sparkles, GraduationCap, Home, Wallet, Award, Users, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useMemo } from "react";

export const Route = createFileRoute("/colleges/$code")({
  loader: ({ params }) => {
    const college = findCollege(params.code);
    if (!college) throw notFound();
    return { college };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "College not found — TNEA.ai" }, { name: "robots", content: "noindex" }] };
    return {
      meta: [
        { title: `${loaderData.college.name} — TNEA.ai` },
        { name: "description", content: loaderData.college.summary },
      ],
    };
  },
  notFoundComponent: () => (
    <AppShell>
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">College not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find a college with that code.</p>
        <Link to="/colleges" className="inline-block mt-4 text-primary font-semibold hover:underline">Back to explorer</Link>
      </div>
    </AppShell>
  ),
  component: Detail,
});

function Detail() {
  const { college } = Route.useLoaderData();
  return (
    <AppShell>
      {/* Header */}
      <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container-page py-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link to="/colleges">Colleges</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{college.shortName}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-6 flex flex-col md:flex-row md:items-start gap-6">
            <div className="grid size-20 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-elegant shrink-0">
              <Building2 className="size-9" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className="font-mono">Code {college.code}</Badge>
                <Badge className="bg-success/15 text-success hover:bg-success/15 border-0">NAAC {college.naac}</Badge>
                {college.nba && <Badge variant="outline">NBA Accredited</Badge>}
                <Badge variant="outline">{college.type}</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{college.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
                <MapPin className="size-4" /> {college.address}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniStat icon={GraduationCap} label="Placement" value={`${college.placementPercentage}%`} />
            <MiniStat icon={Award} label="Highest Pkg" value={`₹${college.highestPackage} LPA`} />
            <MiniStat icon={Star} label="Avg Pkg" value={`₹${college.averagePackage} LPA`} />
            <MiniStat icon={Wallet} label="Fees/Yr" value={`₹${(college.fees / 1000).toFixed(0)}k`} />
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <Tabs defaultValue="overview">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="cutoffs">Cutoffs</TabsTrigger>
            <TabsTrigger value="placements">Placements</TabsTrigger>
            <TabsTrigger value="fees">Fees & Hostel</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="recruiters">Recruiters</TabsTrigger>
            <TabsTrigger value="ai">AI Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{college.summary}</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <Info label="Established" value={String(college.established)} />
                <Info label="Type" value={college.type} />
                <Info label="District" value={college.district} />
                <Info label="Accreditation" value={`NAAC ${college.naac}${college.nba ? " · NBA" : ""}`} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <Card className="p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-4">Courses Offered</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {college.branches.map((b) => (
                  <div key={b} className="p-4 border border-border rounded-xl">
                    <div className="font-semibold text-sm">{b}</div>
                    <div className="text-xs text-muted-foreground mt-1">B.E. / B.Tech · 4 years</div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="cutoffs" className="mt-6">
            <CutoffTab college={college} />
          </TabsContent>

          <TabsContent value="placements" className="mt-6">
            <Card className="p-6 rounded-2xl grid md:grid-cols-3 gap-6">
              <BigStat label="Placement %" value={`${college.placementPercentage}%`} />
              <BigStat label="Highest Package" value={`₹${college.highestPackage} LPA`} />
              <BigStat label="Average Package" value={`₹${college.averagePackage} LPA`} />
            </Card>
          </TabsContent>

          <TabsContent value="fees" className="mt-6">
            <Card className="p-6 rounded-2xl grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Annual Tuition Fees</div>
                <div className="mt-2 text-3xl font-extrabold">₹{college.fees.toLocaleString("en-IN")}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Home className="size-3.5" /> Hostel</div>
                <div className="mt-2 text-3xl font-extrabold">{college.hostel ? `₹${(college.hostelFees ?? 0).toLocaleString("en-IN")}` : "Not available"}</div>
                {college.hostel && <div className="text-sm text-muted-foreground mt-1">per year, mess extra</div>}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="scholarships" className="mt-6">
            <Card className="p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-4">Available Scholarships</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {college.scholarships.map((s) => (
                  <li key={s} className="p-4 border border-border rounded-xl text-sm">{s}</li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="facilities" className="mt-6">
            <Card className="p-6 rounded-2xl">
              <div className="flex flex-wrap gap-2">
                {college.facilities.map((f) => <Badge key={f} variant="secondary" className="py-1.5 px-3">{f}</Badge>)}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="recruiters" className="mt-6">
            <Card className="p-6 rounded-2xl">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Users className="size-5 text-primary" /> Top Recruiters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {college.recruiters.map((r) => (
                  <div key={r} className="p-4 border border-border rounded-xl text-center font-semibold text-sm">{r}</div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <Card className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/20">
              <div className="flex items-center gap-2 text-primary font-bold mb-3">
                <Sparkles className="size-5" /> AI Summary
              </div>
              <p className="leading-relaxed">
                {college.shortName} is a <strong>{college.type.toLowerCase()}</strong> institution in <strong>{college.district}</strong> with a{" "}
                <strong>NAAC {college.naac}</strong> grade. It reports a <strong>{college.placementPercentage}% placement rate</strong>{" "}
                with an average package of <strong>₹{college.averagePackage} LPA</strong> and a highest of <strong>₹{college.highestPackage} LPA</strong>.
                Fees are around <strong>₹{(college.fees / 1000).toFixed(0)}k per year</strong>{college.hostel ? " with hostel facilities" : ""}.
                Its top branches include <strong>{college.branches.slice(0, 3).join(", ")}</strong>. This college is a{" "}
                <strong>{college.placementPercentage >= 95 ? "Dream" : college.placementPercentage >= 88 ? "Target" : "Safe"}</strong>{" "}
                option for aspirants with matching cutoff ranges.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </AppShell>
  );
}

function CutoffTab({ college }: { college: College }) {
  const branches = useMemo(() => Array.from(new Set(college.cutoffs.map((c) => c.branch))), [college]);
  const chartData = useMemo(() => {
    const years = Array.from(new Set(college.cutoffs.map((c) => c.year))).sort();
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      for (const b of branches) {
        const c = college.cutoffs.find((x) => x.year === year && x.branch === b && x.community === "OC");
        if (c) row[b] = c.cutoff;
      }
      return row;
    });
  }, [college, branches]);

  const colors = ["hsl(220 90% 55%)", "hsl(180 70% 45%)", "hsl(150 60% 45%)", "hsl(30 90% 55%)", "hsl(340 80% 55%)"];

  return (
    <Card className="p-6 rounded-2xl">
      <h2 className="text-lg font-bold mb-1">Cutoff History (OC Community)</h2>
      <p className="text-sm text-muted-foreground mb-6">Historical closing cutoffs across branches over the last 5 years.</p>
      <div className="h-72 -ml-2">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis domain={[170, 200]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {branches.map((b, i) => (
              <Line key={b} type="monotone" dataKey={b} stroke={colors[i % colors.length]} strokeWidth={2.5} dot={{ r: 3 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <Card className="p-4 rounded-xl">
      <Icon className="size-4 text-primary mb-2" />
      <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{label}</div>
      <div className="text-lg font-bold mt-0.5">{value}</div>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-muted/50">
      <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{label}</div>
      <div className="text-sm font-semibold mt-1">{value}</div>
    </div>
  );
}

function BigStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4">
      <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{label}</div>
      <div className="text-3xl font-extrabold mt-2 text-primary">{value}</div>
    </div>
  );
}
