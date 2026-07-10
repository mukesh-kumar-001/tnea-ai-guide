import { createFileRoute } from "@tanstack/react-router";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";

const SYSTEM = `You are the TNEA.ai Counselling Assistant. You help Tamil Nadu Engineering Admissions (TNEA) aspirants with:
- College information, branches, cutoffs, placements, fees, hostels
- Counselling rules, quota (OC/BC/BCM/MBC/SC/SCA/ST), rounds, seat matrix
- Rank/cutoff interpretation and decision guidance

Keep answers concise, factual, formatted in short markdown. When you're unsure or the answer depends on the current year's counselling, say so and point the user to the official TNEA portal (tneaonline.org). Use INR (₹) and metric units. Never invent specific cutoff numbers you don't know — give ranges or say "check the Cutoff Explorer".`;

interface ChatBody {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatBody;
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const uiMessages: UIMessage[] = body.messages.map((m, i) => ({
          id: String(i),
          role: m.role,
          parts: [{ type: "text", text: m.content }],
        })) as UIMessage[];

        const result = streamText({
          model: gateway("openai/gpt-5.5"),
          system: SYSTEM,
          messages: await convertToModelMessages(uiMessages),
        });

        return result.toTextStreamResponse();
      },
    },
  },
});
