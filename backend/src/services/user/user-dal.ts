import { Knex } from "knex";

import { TDbClient } from "@app/db";
import {
  TableName,
  TUserActionsInsert,
  TUserActionsUpdate,
  TUserEncryptionKeys,
  TUserEncryptionKeysInsert,
  TUserEncryptionKeysUpdate,
  TUsers
} from "@app/db/schemas";
import { DatabaseError } from "@app/lib/errors";
import { ormify, selectAllTableCols } from "@app/lib/knex";

export type TUserDALFactory = ReturnType<typeof userDALFactory>;

export const userDALFactory = (db: TDbClient) => {
  const userOrm = ormify(db, TableName.Users);
  const findUserByUsername = async (username: string, tx?: Knex) => userOrm.findOne({ username }, tx);

  const getUsersByFilter = async ({
    limit,
    offset,
    searchTerm,
    sortBy
  }: {
    limit: number;
    offset: number;
    searchTerm: string;
    sortBy?: keyof TUsers;
  }) => {
    try {
      let query = db.replicaNode()(TableName.Users).where("isGhost", "=", false);
      if (searchTerm) {
        query = query.where((qb) => {
          void qb
            .whereILike("email", `%${searchTerm}%`)
            .orWhereILike("firstName", `%${searchTerm}%`)
            .orWhereILike("lastName", `%${searchTerm}%`)
            .orWhereLike("username", `%${searchTerm}%`);
        });
      }

      if (sortBy) {
        query = query.orderBy(sortBy);
      }

      return await query.limit(limit).offset(offset).select(selectAllTableCols(TableName.Users));
    } catch (error) {
      throw new DatabaseError({ error, name: "Get users by filter" });
    }
  };

  // USER ENCRYPTION FUNCTIONS
  // -------------------------
  const findUserEncKeyByUsername = async ({ username }: { username: string }) => {
    try {
      return await db
        .replicaNode()(TableName.Users)
        .where({
          username,
          isGhost: false
        })
        .join(TableName.UserEncryptionKey, `${TableName.Users}.id`, `${TableName.UserEncryptionKey}.userId`)
        .first();
    } catch (error) {
      throw new DatabaseError({ error, name: "Find user enc by email" });
    }
  };

  const findUserEncKeyByUserIdsBatch = async ({ userIds }: { userIds: string[] }, tx?: Knex) => {
    try {
      return await (tx || db.replicaNode())(TableName.Users)
        .where({
          isGhost: false
        })
        .whereIn(`${TableName.Users}.id`, userIds)
        .join(TableName.UserEncryptionKey, `${TableName.Users}.id`, `${TableName.UserEncryptionKey}.userId`);
    } catch (error) {
      throw new DatabaseError({ error, name: "Find user enc by user ids batch" });
    }
  };

  const findUserEncKeyByUserId = async (userId: string, tx?: Knex) => {
    try {
      const user = await (tx || db.replicaNode())(TableName.Users)
        .where(`${TableName.Users}.id`, userId)
        .join(TableName.UserEncryptionKey, `${TableName.Users}.id`, `${TableName.UserEncryptionKey}.userId`)
        .first();
      if (user?.id) {
        // change to user id
        user.id = user.userId;
      }
      return user;
    } catch (error) {
      throw new DatabaseError({ error, name: "Find user enc by user id" });
    }
  };

  const findUserByProjectMembershipId = async (projectMembershipId: string) => {
    try {
      return await db
        .replicaNode()(TableName.ProjectMembership)
        .where({ [`${TableName.ProjectMembership}.id` as "id"]: projectMembershipId })
        .join(TableName.Users, `${TableName.ProjectMembership}.userId`, `${TableName.Users}.id`)
        .first();
    } catch (error) {
      throw new DatabaseError({ error, name: "Find user by project membership id" });
    }
  };

  const findUsersByProjectMembershipIds = async (projectMembershipIds: string[]) => {
    try {
      return await db
        .replicaNode()(TableName.ProjectMembership)
        .whereIn(`${TableName.ProjectMembership}.id`, projectMembershipIds)
        .join(TableName.Users, `${TableName.ProjectMembership}.userId`, `${TableName.Users}.id`)
        .select("*");
    } catch (error) {
      throw new DatabaseError({ error, name: "Find users by project membership ids" });
    }
  };

  const createUserEncryption = async (data: TUserEncryptionKeysInsert, tx?: Knex) => {
    try {
      const [userEnc] = await (tx || db)(TableName.UserEncryptionKey).insert(data).returning("*");
      return userEnc;
    } catch (error) {
      throw new DatabaseError({ error, name: "Create user encryption" });
    }
  };

  const updateUserEncryptionByUserId = async (userId: string, data: TUserEncryptionKeysUpdate, tx?: Knex) => {
    try {
      const [userEnc] = await (tx || db)(TableName.UserEncryptionKey)
        .where({ userId })
        .update({ ...data })
        .returning("*");
      return userEnc;
    } catch (error) {
      throw new DatabaseError({ error, name: "Update user enc by user id" });
    }
  };

  const upsertUserEncryptionKey = async (
    userId: string,
    data: Omit<TUserEncryptionKeysUpdate, "userId">,
    tx?: Knex
  ) => {
    try {
      const [userEnc] = await (tx ? tx(TableName.UserEncryptionKey) : db(TableName.UserEncryptionKey))
        // if user insert make sure to pass all required data
        .insert({ userId, ...data } as TUserEncryptionKeys)
        .onConflict("userId")
        .merge()
        .returning("*");
      return userEnc;
    } catch (error) {
      throw new DatabaseError({ error, name: "Upsert user enc key" });
    }
  };

  // USER ACTION FUNCTIONS
  // ---------------------
  const findOneUserAction = (filter: TUserActionsUpdate, tx?: Knex) => {
    try {
      return (tx || db.replicaNode())(TableName.UserAction).where(filter).first("*");
    } catch (error) {
      throw new DatabaseError({ error, name: "Find one user action" });
    }
  };

  const createUserAction = async (data: TUserActionsInsert, tx?: Knex) => {
    try {
      const [userAction] = await (tx || db)(TableName.UserAction).insert(data).returning("*");
      return userAction;
    } catch (error) {
      throw new DatabaseError({ error, name: "Create user action" });
    }
  };

  return {
    ...userOrm,
    findUserByUsername,
    findUserEncKeyByUsername,
    findUserEncKeyByUserIdsBatch,
    findUserEncKeyByUserId,
    updateUserEncryptionByUserId,
    findUserByProjectMembershipId,
    findUsersByProjectMembershipIds,
    upsertUserEncryptionKey,
    createUserEncryption,
    findOneUserAction,
    createUserAction,
    getUsersByFilter
  };
};