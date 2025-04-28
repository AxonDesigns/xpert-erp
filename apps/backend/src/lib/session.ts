import db from "@backend/db";
import sessionTable from "@backend/db/schema/sessions";
import userTable from "@backend/db/schema/users";
import type { Session } from "@backend/db/types/sessions";
import type { PublicUser } from "@backend/db/types/users";
import { userPublicColumns } from "@backend/db/validators/users";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { eq } from "drizzle-orm";


export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: PublicUser["id"]): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
  };
  await db.insert(sessionTable).values(session);
  return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const [result] = await db.select({
    user: userPublicColumns(),
    session: sessionTable,
  }).from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (!result) {
    return {
      session: null,
      user: null,
    };
  }

  const { user, session } = result;

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
    return {
      session: null,
      user: null,
    };
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
    await db.update(sessionTable).set({
      expiresAt: session.expiresAt,
    }).where(eq(sessionTable.id, sessionId));
  }

  return {
    session,
    user,
  };
}

export async function invalidateSession(sessionId: Session["id"]): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function invalidateAllSessions(userId: PublicUser["id"]): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}

export type SessionValidationResult =
  | { session: Session; user: PublicUser }
  | { session: null; user: null };
