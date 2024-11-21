// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { zodBuffer } from "@app/lib/zod";

import { TImmutableDBKeys } from "./models";

export const ProjectsSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  autoCapitalization: z.boolean().default(true).nullable().optional(),
  orgId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  version: z.number().default(1),
  upgradeStatus: z.string().nullable().optional(),
  pitVersionLimit: z.number().default(10),
  kmsCertificateKeyId: z.string().uuid().nullable().optional(),
  auditLogsRetentionDays: z.number().nullable().optional(),
  kmsSecretManagerKeyId: z.string().uuid().nullable().optional(),
  kmsSecretManagerEncryptedDataKey: zodBuffer.nullable().optional()
});

export type TProjects = z.infer<typeof ProjectsSchema>;
export type TProjectsInsert = Omit<z.input<typeof ProjectsSchema>, TImmutableDBKeys>;
export type TProjectsUpdate = Partial<Omit<z.input<typeof ProjectsSchema>, TImmutableDBKeys>>;