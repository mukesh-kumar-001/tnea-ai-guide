import { createFileRoute } from "@tanstack/react-router";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { generateObject } from "ai";
import { z } from "zod";

interface Pick { code: string; name: string; branch: string; probability: number; expectedCutoff: number; }
interface Body {
  student: {
    community: string; gender: string; genRank: string; commRank: string; cutoff: string;
    prefBranches: string[]; prefDistricts: string[]; budget: number; hostel: boolean;
  };
  picks: Pick[];
}

const schema = z.object({
  reasonings: z.record(z.string(), z.string()),
});

export const Route = createFileRoute("/api/counselling")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as Body;
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key, { structuredOutputs: true });

        const prompt = `You are a TNEA counselling advisor. For each college+branch pick below, produce a ONE-sentence reasoning (max 25 words) explaining why it fits or challenges this student. Use plain English, no jargon.

Student profile:
- Community: ${body.student.community}
- General Rank: ${body.student.genRank}, Community Rank: ${body.student.commRank}
- Cutoff: ${body.student.cutoff}/200
- Preferred branches: ${body.student.prefBranches.join(", ") || "any"}
- Preferred districts: ${body.student.prefDistricts.join(", ") || "any"}
- Budget: ₹${body.student.budget.toLocaleString("en-IN")} / year
- Hostel required: ${body.student.hostel ? "yes" : "no"}

Picks (return reasonings with key "CODE-BRANCH"):
${body.picks.map((p) => `- ${p.code}-${p.branch}: ${p.name} · expected cutoff ${p.expectedCutoff.toFixed(1)} · admission probability ${p.probability}%`).join("\n")}

Return JSON: { "reasonings": { "CODE-BRANCH": "one sentence", ... } }`;

        try {
          const { object } = await generateObject({
            model: gateway("openai/gpt-5.5"),
            schema,
            prompt,
          });
          return new Response(JSON.stringify(object), { headers: { "content-type": "application/json" } });
        } catch (e) {
          console.error("counselling AI error", e);
          // Fallback: heuristic sentences
          const reasonings: Record<string, string> = {};
          for (const p of body.picks) {
            const key = `${p.code}-${p.branch}`;
            reasonings[key] = p.probability >= 70
              ? `Strong safe option — your cutoff comfortably exceeds the typical ${p.expectedCutoff.toFixed(1)} closing mark.`
              : p.probability >= 35
              ? `Realistic target — your cutoff is close to the expected closing mark of ${p.expectedCutoff.toFixed(1)}.`
              : `Ambitious pick — expected closing cutoff ${p.expectedCutoff.toFixed(1)} is above your current profile.`;
          }
          return new Response(JSON.stringify({ reasonings }), { headers: { "content-type": "application/json" } });
        }
      },
    },
  },
});
