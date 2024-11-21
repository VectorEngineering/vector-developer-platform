// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const ExternalGroupOrgRoleMappingsSchema = z.object({
  id: z.string().uuid(),
  groupName: z.string(),
  role: z.string(),
  roleId: z.string().uuid().nullable().optional(),
  orgId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TExternalGroupOrgRoleMappings = z.infer<typeof ExternalGroupOrgRoleMappingsSchema>;
export type TExternalGroupOrgRoleMappingsInsert = Omit<
  z.input<typeof ExternalGroupOrgRoleMappingsSchema>,
  TImmutableDBKeys
>;
export type TExternalGroupOrgRoleMappingsUpdate = Partial<
  Omit<z.input<typeof ExternalGroupOrgRoleMappingsSchema>, TImmutableDBKeys>
>;
