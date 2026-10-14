import { and, count, desc, eq, gte, sql } from "@repo/database";
import db from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { formsTable } from "@repo/database/models/form";
import { formResponsesTable } from "@repo/database/models/response";
import { formAnalyticsTable } from "@repo/database/models/analytics";

export interface PlatformOverview {
  days: number;
  totals: { users: number; forms: number; publishedForms: number; responses: number; views: number };
  inPeriod: { users: number; forms: number; responses: number; views: number };
  daily: Array<{ date: string; signups: number; forms: number; responses: number; views: number }>;
  formsByStatus: Array<{ status: string; count: number }>;
  topForms: Array<{ id: string; title: string; slug: string; status: string; ownerEmail: string; responses: number }>;
  recentUsers: Array<{ id: string; fullName: string | null; email: string; createdAt: string | null; forms: number }>;
}

/* "YYYY-MM-DD" for each of the last `days` days, oldest first */
function lastDays(days: number): string[] {
  const out: string[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

function toMap(rows: Array<{ date: string; n: number | string }>) {
  return new Map(rows.map((r) => [String(r.date).slice(0, 10), Number(r.n)]));
}

/** Platform-wide numbers for the admin panel. Callers must check admin access first. */
class AdminService {
  async getPlatformOverview(days: number): Promise<PlatformOverview> {
    const since = new Date();
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (days - 1));

    const [[users], [forms], [published], [responses], [views]] = await Promise.all([
      db.select({ n: count() }).from(usersTable),
      db.select({ n: count() }).from(formsTable),
      db.select({ n: count() }).from(formsTable).where(eq(formsTable.status, "published")),
      db.select({ n: count() }).from(formResponsesTable),
      db.select({ n: count() }).from(formAnalyticsTable).where(eq(formAnalyticsTable.event, "view")),
    ]);

    const day = (col: unknown) => sql<string>`DATE(${col})`;

    const [signupRows, formRows, responseRows, viewRows] = await Promise.all([
      db.select({ date: day(usersTable.createdAt), n: count() }).from(usersTable)
        .where(gte(usersTable.createdAt, since)).groupBy(day(usersTable.createdAt)),
      db.select({ date: day(formsTable.createdAt), n: count() }).from(formsTable)
        .where(gte(formsTable.createdAt, since)).groupBy(day(formsTable.createdAt)),
      db.select({ date: day(formResponsesTable.submittedAt), n: count() }).from(formResponsesTable)
        .where(gte(formResponsesTable.submittedAt, since)).groupBy(day(formResponsesTable.submittedAt)),
      db.select({ date: day(formAnalyticsTable.occurredAt), n: count() }).from(formAnalyticsTable)
        .where(and(gte(formAnalyticsTable.occurredAt, since), eq(formAnalyticsTable.event, "view")))
        .groupBy(day(formAnalyticsTable.occurredAt)),
    ]);

    const s = toMap(signupRows), f = toMap(formRows), r = toMap(responseRows), v = toMap(viewRows);
    const daily = lastDays(days).map((date) => ({
      date,
      signups: s.get(date) ?? 0,
      forms: f.get(date) ?? 0,
      responses: r.get(date) ?? 0,
      views: v.get(date) ?? 0,
    }));
    const sum = (k: "signups" | "forms" | "responses" | "views") => daily.reduce((a, d) => a + d[k], 0);

    const statusRows = await db
      .select({ status: formsTable.status, n: count() })
      .from(formsTable)
      .groupBy(formsTable.status);

    const responseCount = count(formResponsesTable.id);
    const topRows = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        slug: formsTable.slug,
        status: formsTable.status,
        ownerEmail: usersTable.email,
        responses: responseCount,
      })
      .from(formsTable)
      .innerJoin(usersTable, eq(usersTable.id, formsTable.userId))
      .leftJoin(
        formResponsesTable,
        and(eq(formResponsesTable.formId, formsTable.id), gte(formResponsesTable.submittedAt, since)),
      )
      .groupBy(formsTable.id, usersTable.email)
      .orderBy(desc(responseCount))
      .limit(8);

    const formsPerUser = count(formsTable.id);
    const recentRows = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        createdAt: usersTable.createdAt,
        forms: formsPerUser,
      })
      .from(usersTable)
      .leftJoin(formsTable, eq(formsTable.userId, usersTable.id))
      .groupBy(usersTable.id)
      .orderBy(desc(usersTable.createdAt))
      .limit(10);

    return {
      days,
      totals: {
        users: Number(users?.n ?? 0),
        forms: Number(forms?.n ?? 0),
        publishedForms: Number(published?.n ?? 0),
        responses: Number(responses?.n ?? 0),
        views: Number(views?.n ?? 0),
      },
      inPeriod: { users: sum("signups"), forms: sum("forms"), responses: sum("responses"), views: sum("views") },
      daily,
      formsByStatus: statusRows.map((x) => ({ status: x.status, count: Number(x.n) })),
      topForms: topRows.map((x) => ({ ...x, responses: Number(x.responses) })),
      recentUsers: recentRows.map((x) => ({
        ...x,
        createdAt: x.createdAt ? x.createdAt.toISOString() : null,
        forms: Number(x.forms),
      })),
    };
  }
}

export default AdminService;
