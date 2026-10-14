import { and, eq, count, sql, gte, lte, desc, inArray } from "@repo/database";
import db from "@repo/database";
import {
  formAnalyticsTable,
  type InsertFormAnalytics,
} from "@repo/database/models/analytics";
import { formResponsesTable } from "@repo/database/models/response";
import { createHash } from "crypto";
import { BaseService } from "../base";

export interface FormAnalyticsSummary {
  formId: string;
  totalViews: number;
  uniqueViews: number;
  totalStarts: number;
  totalSubmissions: number;
  totalAbandons: number;
  completionRate: number;
  avgCompletionTimeMs: number | null;
  topCountries: Array<{ country: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  dailySubmissions: Array<{ date: string; count: number }>;
  dailyEvents: Array<{ date: string; views: number; starts: number; submissions: number; abandons: number }>;
}

export class AnalyticsService extends BaseService {

  async trackEvent(data: Omit<InsertFormAnalytics, "id" | "occurredAt">): Promise<void> {

    const sessionHash = data.ipAddress
      ? createHash("sha256").update(data.ipAddress + data.formId).digest("hex")
      : undefined;

    await db.insert(formAnalyticsTable).values({
      ...data,
      sessionHash,
    });
  }

  async getFormAnalytics(
    formId: string,
    opts: { from?: Date; to?: Date } = {},
  ): Promise<FormAnalyticsSummary> {
    return { ...(await this.getAnalyticsForForms([formId], opts)), formId };
  }

  /** Per-form totals for a set of forms, for the cross-form breakdown */
  async getPerFormTotals(
    formIds: string[],
    opts: { from?: Date; to?: Date } = {},
  ): Promise<Array<{ formId: string; views: number; starts: number; submissions: number; abandons: number }>> {
    if (formIds.length === 0) return [];
    const rows = await db
      .select({ formId: formAnalyticsTable.formId, event: formAnalyticsTable.event, total: count() })
      .from(formAnalyticsTable)
      .where(
        and(
          inArray(formAnalyticsTable.formId, formIds),
          opts.from ? gte(formAnalyticsTable.occurredAt, opts.from) : undefined,
          opts.to ? lte(formAnalyticsTable.occurredAt, opts.to) : undefined,
        ),
      )
      .groupBy(formAnalyticsTable.formId, formAnalyticsTable.event);

    const map = new Map(formIds.map((id) => [id, { formId: id, views: 0, starts: 0, submissions: 0, abandons: 0 }]));
    for (const r of rows) {
      const e = map.get(r.formId);
      if (!e) continue;
      const n = Number(r.total);
      if (r.event === "view")    e.views       = n;
      if (r.event === "start")   e.starts      = n;
      if (r.event === "submit")  e.submissions = n;
      if (r.event === "abandon") e.abandons    = n;
    }
    return [...map.values()];
  }

  /** The same summary as getFormAnalytics, across any set of forms (formId is "all") */
  async getAnalyticsForForms(
    formIds: string[],
    opts: { from?: Date; to?: Date } = {},
  ): Promise<FormAnalyticsSummary> {
    if (formIds.length === 0) {
      return {
        formId: "all", totalViews: 0, uniqueViews: 0, totalStarts: 0, totalSubmissions: 0, totalAbandons: 0,
        completionRate: 0, avgCompletionTimeMs: null, topCountries: [], topReferrers: [], dailySubmissions: [], dailyEvents: [],
      };
    }
    const timeFilter = and(
      inArray(formAnalyticsTable.formId, formIds),
      opts.from ? gte(formAnalyticsTable.occurredAt, opts.from) : undefined,
      opts.to ? lte(formAnalyticsTable.occurredAt, opts.to) : undefined,
    );

    const eventCounts = await db
      .select({
        event: formAnalyticsTable.event,
        total: count(),
      })
      .from(formAnalyticsTable)
      .where(timeFilter)
      .groupBy(formAnalyticsTable.event);

    const byEvent = Object.fromEntries(eventCounts.map((r) => [r.event, Number(r.total)]));

    const uniqueViewsResult = await db
      .select({
        uniqueViews: sql<number>`COUNT(DISTINCT ${formAnalyticsTable.sessionHash})`,
      })
      .from(formAnalyticsTable)
      .where(and(timeFilter, eq(formAnalyticsTable.event, "view")));
    const uniqueViews = uniqueViewsResult[0]?.uniqueViews ?? 0;

    const avgMsResult = await db
      .select({
        avgMs: sql<number | null>`AVG(${formResponsesTable.completionTimeMs})`,
      })
      .from(formResponsesTable)
      .where(
        and(
          inArray(formResponsesTable.formId, formIds),
          opts.from ? gte(formResponsesTable.submittedAt, opts.from) : undefined,
          opts.to ? lte(formResponsesTable.submittedAt, opts.to) : undefined,
        ),
      );
    const avgMs = avgMsResult[0]?.avgMs ?? null;

    const topCountries = await db
      .select({
        country: formAnalyticsTable.country,
        count: count(),
      })
      .from(formAnalyticsTable)
      .where(and(timeFilter, eq(formAnalyticsTable.event, "view")))
      .groupBy(formAnalyticsTable.country)
      .orderBy(desc(count()))
      .limit(10);

    const topReferrers = await db
      .select({
        referrer: formAnalyticsTable.referrer,
        count: count(),
      })
      .from(formAnalyticsTable)
      .where(
        and(
          timeFilter,
          eq(formAnalyticsTable.event, "view"),
          sql`${formAnalyticsTable.referrer} IS NOT NULL`,
        ),
      )
      .groupBy(formAnalyticsTable.referrer)
      .orderBy(desc(count()))
      .limit(10);

    const dailySubmissions = await db
      .select({
        date: sql<string>`DATE(${formAnalyticsTable.occurredAt})`,
        count: count(),
      })
      .from(formAnalyticsTable)
      .where(and(timeFilter, eq(formAnalyticsTable.event, "submit")))
      .groupBy(sql`DATE(${formAnalyticsTable.occurredAt})`)
      .orderBy(sql`DATE(${formAnalyticsTable.occurredAt})`);

    const dailyEventRows = await db
      .select({
        date:  sql<string>`DATE(${formAnalyticsTable.occurredAt})`,
        event: formAnalyticsTable.event,
        count: count(),
      })
      .from(formAnalyticsTable)
      .where(timeFilter)
      .groupBy(sql`DATE(${formAnalyticsTable.occurredAt})`, formAnalyticsTable.event)
      .orderBy(sql`DATE(${formAnalyticsTable.occurredAt})`);

    // Pivot the rows into one entry per date
    const dailyMap = new Map<string, { views: number; starts: number; submissions: number; abandons: number }>();
    for (const row of dailyEventRows) {
      if (!dailyMap.has(row.date)) {
        dailyMap.set(row.date, { views: 0, starts: 0, submissions: 0, abandons: 0 });
      }
      const entry = dailyMap.get(row.date)!;
      const n = Number(row.count);
      if (row.event === "view")    entry.views       = n;
      if (row.event === "start")   entry.starts      = n;
      if (row.event === "submit")  entry.submissions = n;
      if (row.event === "abandon") entry.abandons    = n;
    }
    const dailyEvents = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => ({ date, ...counts }));

    const totalViews = byEvent["view"] ?? 0;
    const totalStarts = byEvent["start"] ?? 0;
    const totalSubmissions = byEvent["submit"] ?? 0;
    const totalAbandons = byEvent["abandon"] ?? 0;
    const completionRate =
      totalViews > 0 ? Math.round((totalSubmissions / totalViews) * 100) : 0;

    return {
      formId: "all",
      totalViews,
      uniqueViews: Number(uniqueViews ?? 0),
      totalStarts,
      totalSubmissions,
      totalAbandons,
      completionRate,
      avgCompletionTimeMs: avgMs ? Math.round(Number(avgMs)) : null,
      topCountries: topCountries
        .filter((r) => r.country !== null)
        .map((r) => ({ country: r.country!, count: Number(r.count) })),
      topReferrers: topReferrers
        .filter((r) => r.referrer !== null)
        .map((r) => ({ referrer: r.referrer!, count: Number(r.count) })),
      dailySubmissions: dailySubmissions.map((r) => ({
        date: r.date,
        count: Number(r.count),
      })),
      dailyEvents,
    };
  }
}

export default AnalyticsService;
