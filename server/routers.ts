import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
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
});

export type AppRouter = typeof appRouter;
