import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Database, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TNEA.ai" },
      { name: "description", content: "TNEA.ai is an independent, AI-powered assistant for Tamil Nadu Engineering Admissions. Learn about our mission, data and team." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <AppShell>
      <section className="container-page py-16 max-w-4xl">
        <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">About</div>
        <h1 className="text-4xl font-extrabold tracking-tight">Made for Tamil Nadu aspirants</h1>
        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          TNEA.ai is an independent counselling assistant that helps Tamil Nadu engineering aspirants make informed decisions during the admissions process. We combine verified historical cutoff data with modern AI to surface the right colleges, branches and choices for every profile.
        </p>

        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          <Card className="p-6 rounded-2xl">
            <ShieldCheck className="size-6 text-primary mb-3" />
            <h3 className="font-bold">Trustworthy</h3>
            <p className="text-sm text-muted-foreground mt-2">Cutoffs and seat matrix data reference official DoTE / TNEA publications.</p>
          </Card>
          <Card className="p-6 rounded-2xl">
            <Database className="size-6 text-primary mb-3" />
            <h3 className="font-bold">Data-driven</h3>
            <p className="text-sm text-muted-foreground mt-2">10 years of counselling history feeds every recommendation you see.</p>
          </Card>
          <Card className="p-6 rounded-2xl">
            <Sparkles className="size-6 text-primary mb-3" />
            <h3 className="font-bold">AI-augmented</h3>
            <p className="text-sm text-muted-foreground mt-2">Large language models generate reasoning and answer counselling questions in plain language.</p>
          </Card>
          <Card className="p-6 rounded-2xl">
            <Users className="size-6 text-primary mb-3" />
            <h3 className="font-bold">Community-first</h3>
            <p className="text-sm text-muted-foreground mt-2">Free access, no hidden fees. We want every student to file the best possible choice list.</p>
          </Card>
        </div>

        <div className="mt-16 rounded-2xl border border-border p-6 bg-muted/40 text-sm text-muted-foreground">
          <strong className="text-foreground">Disclaimer.</strong> TNEA.ai is an independent third-party tool and is not affiliated with the Directorate of Technical Education, Tamil Nadu. Always verify final information from the official <em>tneaonline.org</em> portal before submitting your choices.
        </div>
      </section>
    </AppShell>
  );
}
