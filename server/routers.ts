import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { createQuoteRequest, getPublicSettings, listPublicProjects, listPublicServices } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  catalog: router({
    services: publicProcedure.input(z.object({ category: z.string().optional() }).optional()).query(({ input }) => listPublicServices(input?.category)),
    projects: publicProcedure.input(z.object({ category: z.string().optional() }).optional()).query(({ input }) => listPublicProjects(input?.category)),
    settings: publicProcedure.query(() => getPublicSettings()),
  }),
  briefing: router({
    submit: publicProcedure.input(z.object({
      name: z.string().min(1).max(180), company: z.string().max(180).optional(), phone: z.string().max(80).optional(), email: z.string().email().max(320).optional().or(z.literal("")), services: z.array(z.string().max(180)).max(12), projectType: z.string().max(180).optional(), deadline: z.string().max(100).optional(), budget: z.string().max(120).optional(), description: z.string().max(5000).optional(), preferredContact: z.enum(["whatsapp", "email", "phone"]),
    })).mutation(async ({ input }) => { const result = await createQuoteRequest({ ...input, services: JSON.stringify(input.services), email: input.email || null }); return { success: true, requestId: result.id }; }),
  }),
  assistant: router({
    recommend: publicProcedure.input(z.object({ message: z.string().min(1).max(1200), history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(1600) })).max(8).default([]) })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "És o assistente virtual da FAMU STUDIO, um estúdio de design, dados e soluções digitais em Malange, Angola. Responde em português de Angola, com tom humano, claro e premium. Ajuda a escolher entre: Design gráfico, Identidade visual, Portfólios profissionais, Excel & dashboards, Apresentações profissionais, Social media design, Materiais de formação e Websites & presença digital. Faz no máximo uma pergunta de clarificação quando necessário. Recomenda um serviço principal e, se fizer sentido, um complemento. Não inventes preços, clientes, resultados ou prazos. Mantém a resposta abaixo de 100 palavras e termina com um próximo passo prático." },
          ...input.history.map((item) => ({ role: item.role as "user" | "assistant", content: item.content })),
          { role: "user", content: input.message },
        ],
      });
      const content = response.choices?.[0]?.message?.content;
      const answer = typeof content === "string" ? content : Array.isArray(content) ? content.map((part) => "text" in part ? part.text : "").join("") : "Posso ajudar a organizar a sua necessidade. Comece por me dizer o que pretende criar ou melhorar.";
      return { answer };
    }),
  }),
});

export type AppRouter = typeof appRouter;
