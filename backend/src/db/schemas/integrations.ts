// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const IntegrationsSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean(),
  url: z.string().nullable().optional(),
  app: z.string().nullable().optional(),
  appId: z.string().nullable().optional(),
  targetEnvironment: z.string().nullable().optional(),
  targetEnvironmentId: z.string().nullable().optional(),
  targetService: z.string().nullable().optional(),
  targetServiceId: z.string().nullable().optional(),
  owner: z.string().nullable().optional(),
  path: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  scope: z.string().nullable().optional(),
  integration: z.string(),
  metadata: z.unknown().nullable().optional(),
  integrationAuthId: z.string().uuid(),
  envId: z.string().uuid(),
  secretPath: z.string().default("/"),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastUsed: z.date().nullable().optional(),
  isSynced: z.boolean().nullable().optional(),
  syncMessage: z.string().nullable().optional(),
  lastSyncJobId: z.string().nullable().optional()
});

export type TIntegrations = z.infer<typeof IntegrationsSchema>;
export type TIntegrationsInsert = Omit<z.input<typeof IntegrationsSchema>, TImmutableDBKeys>;
export type TIntegrationsUpdate = Partial<Omit<z.input<typeof IntegrationsSchema>, TImmutableDBKeys>>;