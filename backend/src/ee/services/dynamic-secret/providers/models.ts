import { z } from "zod";

export enum SqlProviders {
  Postgres = "postgres",
  MySQL = "mysql2",
  Oracle = "oracledb",
  MsSQL = "mssql"
}

export enum ElasticSearchAuthTypes {
  User = "user",
  ApiKey = "api-key"
}

export enum LdapCredentialType {
  Dynamic = "dynamic",
  Static = "static"
}

export const DynamicSecretRedisDBSchema = z.object({
  host: z.string().trim().toLowerCase(),
  port: z.number(),
  username: z.string().trim(), // this is often "default".
  password: z.string().trim().optional(),
  creationStatement: z.string().trim(),
  revocationStatement: z.string().trim(),
  renewStatement: z.string().trim().optional(),
  ca: z.string().optional()
});

export const DynamicSecretAwsElastiCacheSchema = z.object({
  clusterName: z.string().trim().min(1),
  accessKeyId: z.string().trim().min(1),
  secretAccessKey: z.string().trim().min(1),

  region: z.string().trim(),
  creationStatement: z.string().trim(),
  revocationStatement: z.string().trim(),
  ca: z.string().optional()
});

export const DynamicSecretElasticSearchSchema = z.object({
  host: z.string().trim().min(1),
  port: z.number(),
  roles: z.array(z.string().trim().min(1)).min(1),

  // two auth types "user, apikey"
  auth: z.discriminatedUnion("type", [
    z.object({
      type: z.literal(ElasticSearchAuthTypes.User),
      username: z.string().trim(),
      password: z.string().trim()
    }),
    z.object({
      type: z.literal(ElasticSearchAuthTypes.ApiKey),
      apiKey: z.string().trim(),
      apiKeyId: z.string().trim()
    })
  ]),

  ca: z.string().optional()
});

export const DynamicSecretRabbitMqSchema = z.object({
  host: z.string().trim().min(1),
  port: z.number(),
  tags: z.array(z.string().trim()).default([]),

  username: z.string().trim().min(1),
  password: z.string().trim().min(1),

  ca: z.string().optional(),

  virtualHost: z.object({
    name: z.string().trim().min(1),
    permissions: z.object({
      read: z.string().trim().min(1),
      write: z.string().trim().min(1),
      configure: z.string().trim().min(1)
    })
  })
});

export const DynamicSecretSqlDBSchema = z.object({
  client: z.nativeEnum(SqlProviders),
  host: z.string().trim().toLowerCase(),
  port: z.number(),
  database: z.string().trim(),
  username: z.string().trim(),
  password: z.string().trim(),
  creationStatement: z.string().trim(),
  revocationStatement: z.string().trim(),
  renewStatement: z.string().trim().optional(),
  ca: z.string().optional()
});

export const DynamicSecretCassandraSchema = z.object({
  host: z.string().trim().toLowerCase(),
  port: z.number(),
  localDataCenter: z.string().trim().min(1),
  keyspace: z.string().trim().optional(),
  username: z.string().trim(),
  password: z.string().trim(),
  creationStatement: z.string().trim(),
  revocationStatement: z.string().trim(),
  renewStatement: z.string().trim().optional(),
  ca: z.string().optional()
});

export const DynamicSecretAwsIamSchema = z.object({
  accessKey: z.string().trim().min(1),
  secretAccessKey: z.string().trim().min(1),
  region: z.string().trim().min(1),
  awsPath: z.string().trim().optional(),
  permissionBoundaryPolicyArn: z.string().trim().optional(),
  policyDocument: z.string().trim().optional(),
  userGroups: z.string().trim().optional(),
  policyArns: z.string().trim().optional()
});

export const DynamicSecretMongoAtlasSchema = z.object({
  adminPublicKey: z.string().trim().min(1).describe("Admin user public api key"),
  adminPrivateKey: z.string().trim().min(1).describe("Admin user private api key"),
  groupId: z
    .string()
    .trim()
    .min(1)
    .describe("Unique 24-hexadecimal digit string that identifies your project. This is same as project id"),
  roles: z
    .object({
      collectionName: z.string().optional().describe("Collection on which this role applies."),
      databaseName: z.string().min(1).describe("Database to which the user is granted access privileges."),
      roleName: z
        .string()
        .min(1)
        .describe(
          ' Enum: "atlasAdmin" "backup" "clusterMonitor" "dbAdmin" "dbAdminAnyDatabase" "enableSharding" "read" "readAnyDatabase" "readWrite" "readWriteAnyDatabase" "<a custom role name>".Human-readable label that identifies a group of privileges assigned to a database user. This value can either be a built-in role or a custom role.'
        )
    })
    .array()
    .min(1),
  scopes: z
    .object({
      name: z
        .string()
        .min(1)
        .describe(
          "Human-readable label that identifies the cluster or MongoDB Atlas Data Lake that this database user can access."
        ),
      type: z
        .string()
        .min(1)
        .describe("Category of resource that this database user can access. Enum: CLUSTER, DATA_LAKE, STREAM")
    })
    .array()
});

export const DynamicSecretMongoDBSchema = z.object({
  host: z.string().min(1).trim().toLowerCase(),
  port: z.number().optional(),
  username: z.string().min(1).trim(),
  password: z.string().min(1).trim(),
  database: z.string().min(1).trim(),
  ca: z.string().min(1).optional(),
  roles: z
    .string()
    .array()
    .min(1)
    .describe(
      'Enum: "atlasAdmin" "backup" "clusterMonitor" "dbAdmin" "dbAdminAnyDatabase" "enableSharding" "read" "readAnyDatabase" "readWrite" "readWriteAnyDatabase" "<a custom role name>".Human-readable label that identifies a group of privileges assigned to a database user. This value can either be a built-in role or a custom role.'
    )
});

export const DynamicSecretSapHanaSchema = z.object({
  host: z.string().trim().toLowerCase(),
  port: z.number(),
  username: z.string().trim(),
  password: z.string().trim(),
  creationStatement: z.string().trim(),
  revocationStatement: z.string().trim(),
  renewStatement: z.string().trim().optional(),
  ca: z.string().optional()
});

export const DynamicSecretSnowflakeSchema = z.object({
  accountId: z.string().trim().min(1),
  orgId: z.string().trim().min(1),
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
  creationStatement: z.string().trim().min(1),
  revocationStatement: z.string().trim().min(1),
  renewStatement: z.string().trim().optional()
});

export const AzureEntraIDSchema = z.object({
  tenantId: z.string().trim().min(1),
  userId: z.string().trim().min(1),
  email: z.string().trim().min(1),
  applicationId: z.string().trim().min(1),
  clientSecret: z.string().trim().min(1)
});

export const LdapSchema = z.union([
  z.object({
    url: z.string().trim().min(1),
    binddn: z.string().trim().min(1),
    bindpass: z.string().trim().min(1),
    ca: z.string().optional(),
    credentialType: z.literal(LdapCredentialType.Dynamic).optional().default(LdapCredentialType.Dynamic),
    creationLdif: z.string().min(1),
    revocationLdif: z.string().min(1),
    rollbackLdif: z.string().optional()
  }),
  z.object({
    url: z.string().trim().min(1),
    binddn: z.string().trim().min(1),
    bindpass: z.string().trim().min(1),
    ca: z.string().optional(),
    credentialType: z.literal(LdapCredentialType.Static),
    rotationLdif: z.string().min(1)
  })
]);

export enum DynamicSecretProviders {
  SqlDatabase = "sql-database",
  Cassandra = "cassandra",
  AwsIam = "aws-iam",
  Redis = "redis",
  AwsElastiCache = "aws-elasticache",
  MongoAtlas = "mongo-db-atlas",
  ElasticSearch = "elastic-search",
  MongoDB = "mongo-db",
  RabbitMq = "rabbit-mq",
  AzureEntraID = "azure-entra-id",
  Ldap = "ldap",
  SapHana = "sap-hana",
  Snowflake = "snowflake"
}

export const DynamicSecretProviderSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal(DynamicSecretProviders.SqlDatabase), inputs: DynamicSecretSqlDBSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.Cassandra), inputs: DynamicSecretCassandraSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.AwsIam), inputs: DynamicSecretAwsIamSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.Redis), inputs: DynamicSecretRedisDBSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.SapHana), inputs: DynamicSecretSapHanaSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.AwsElastiCache), inputs: DynamicSecretAwsElastiCacheSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.MongoAtlas), inputs: DynamicSecretMongoAtlasSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.ElasticSearch), inputs: DynamicSecretElasticSearchSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.MongoDB), inputs: DynamicSecretMongoDBSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.RabbitMq), inputs: DynamicSecretRabbitMqSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.AzureEntraID), inputs: AzureEntraIDSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.Ldap), inputs: LdapSchema }),
  z.object({ type: z.literal(DynamicSecretProviders.Snowflake), inputs: DynamicSecretSnowflakeSchema })
]);

export type TDynamicProviderFns = {
  create: (inputs: unknown, expireAt: number) => Promise<{ entityId: string; data: unknown }>;
  validateConnection: (inputs: unknown) => Promise<boolean>;
  validateProviderInputs: (inputs: object) => Promise<unknown>;
  revoke: (inputs: unknown, entityId: string) => Promise<{ entityId: string }>;
  renew: (inputs: unknown, entityId: string, expireAt: number) => Promise<{ entityId: string }>;
};