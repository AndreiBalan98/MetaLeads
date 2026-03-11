import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLeads, parseDateTime } from "@/lib/dataService";
import type { Lead } from "@/lib/dataService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const PERIODS = ["Today", "This Week", "This Month"] as const;

const formatAvgResponse = (diffs: number[]): string => {
  if (diffs.length === 0) return "—";
  const avgMs = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const totalMin = Math.floor(avgMs / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${totalMin}m`;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const filterByPeriod = (leads: Lead[], period: string): Lead[] => {
  const now = new Date();
  if (period === "Today") {
    return leads.filter((l) => {
      const d = l.submittedAt;
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      );
    });
  }
  if (period === "This Week") {
    const since = new Date(Date.now() - 7 * 86400000);
    return leads.filter((l) => l.submittedAt >= since);
  }
  // This Month = 30 days
  const since = new Date(Date.now() - 30 * 86400000);
  return leads.filter((l) => l.submittedAt >= since);
};

const AnalyticsView = () => {
  const [period, setPeriod] = useState<string>("This Week");

  const { data: allLeads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: getAllLeads,
  });

  const filteredLeads = useMemo(
    () => filterByPeriod(allLeads, period),
    [allLeads, period]
  );

  // Top-level metrics
  const totalLeads = filteredLeads.length;
  const contacted = filteredLeads.filter((l) =>
    ["CONTACTED", "QUALIFIED", "CONVERTED"].includes(l.lead_status)
  ).length;
  const contactedRate = totalLeads > 0 ? Math.round((contacted / totalLeads) * 100) : 0;
  const converted = filteredLeads.filter((l) => l.lead_status === "CONVERTED").length;
  const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;

  const responseDiffs = filteredLeads
    .filter((l) => l.response_time)
    .map((l) => parseDateTime(l.response_time).getTime() - l.submittedAt.getTime())
    .filter((d) => d > 0);
  const avgResponseStr = formatAvgResponse(responseDiffs);

  const metrics = [
    { label: "Total Leads", value: String(totalLeads) },
    { label: "Contacted Rate", value: `${contactedRate}%` },
    { label: "Avg. Response Time", value: avgResponseStr },
    { label: "Conversion Rate", value: `${conversionRate}%` },
  ];

  // Leads Over Time
  const leadsOverTime = useMemo(() => {
    if (period === "Today") {
      const hours: Record<number, number> = {};
      filteredLeads.forEach((l) => {
        const h = l.submittedAt.getHours();
        hours[h] = (hours[h] || 0) + 1;
      });
      return Array.from({ length: 24 }, (_, h) => ({
        date: `${h}:00`,
        leads: hours[h] || 0,
      }));
    }
    const days = period === "This Week" ? 7 : 30;
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - (days - 1 - i) * 86400000);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const count = filteredLeads.filter((l) => {
        const ld = l.submittedAt;
        return (
          ld.getFullYear() === d.getFullYear() &&
          ld.getMonth() === d.getMonth() &&
          ld.getDate() === d.getDate()
        );
      }).length;
      return { date: label, leads: count };
    });
  }, [filteredLeads, period]);

  // Response Time Distribution
  const responseTimeData = useMemo(() => {
    const buckets: Record<string, number> = {
      "< 1 min": 0,
      "1–5 min": 0,
      "5–30 min": 0,
      "30–60 min": 0,
      "> 1 hr": 0,
    };
    filteredLeads
      .filter((l) => l.response_time)
      .forEach((l) => {
        const diff =
          (parseDateTime(l.response_time).getTime() - l.submittedAt.getTime()) / 60000;
        if (diff < 1) buckets["< 1 min"]++;
        else if (diff < 5) buckets["1–5 min"]++;
        else if (diff < 30) buckets["5–30 min"]++;
        else if (diff < 60) buckets["30–60 min"]++;
        else buckets["> 1 hr"]++;
      });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  }, [filteredLeads]);

  // Pipeline Funnel
  const funnelData = useMemo(() => {
    return (["NEW", "CONTACTED", "QUALIFIED", "CONVERTED"] as const).map((s) => ({
      stage: s.charAt(0) + s.slice(1).toLowerCase(),
      value: filteredLeads.filter((l) => l.lead_status === s).length,
    }));
  }, [filteredLeads]);
  const funnelMax = Math.max(...funnelData.map((d) => d.value), 1);

  // Leads by Campaign
  const campaignData = useMemo(() => {
    const map: Record<string, { leads: number; converted: number }> = {};
    filteredLeads.forEach((l) => {
      if (!map[l.campaign_name]) map[l.campaign_name] = { leads: 0, converted: 0 };
      map[l.campaign_name].leads++;
      if (l.lead_status === "CONVERTED") map[l.campaign_name].converted++;
    });
    return Object.entries(map)
      .map(([campaign, d]) => ({
        campaign,
        leads: d.leads,
        conversionRate: Math.round((d.converted / d.leads) * 100),
      }))
      .sort((a, b) => b.leads - a.leads);
  }, [filteredLeads]);
  const maxCampaignLeads = Math.max(...campaignData.map((c) => c.leads), 1);

  // Team Performance
  const teamPerformance = useMemo(() => {
    const map: Record<
      string,
      {
        name: string;
        role: string;
        leads: number;
        contacted: number;
        converted: number;
        responseDiffs: number[];
      }
    > = {};
    filteredLeads.forEach((l) => {
      const key = l.assigned_to.email;
      if (!map[key]) {
        map[key] = {
          name: l.assigned_to.name,
          role: l.assigned_to.role,
          leads: 0,
          contacted: 0,
          converted: 0,
          responseDiffs: [],
        };
      }
      map[key].leads++;
      if (["CONTACTED", "QUALIFIED", "CONVERTED"].includes(l.lead_status))
        map[key].contacted++;
      if (l.lead_status === "CONVERTED") map[key].converted++;
      if (l.response_time) {
        const diff =
          parseDateTime(l.response_time).getTime() - l.submittedAt.getTime();
        if (diff > 0) map[key].responseDiffs.push(diff);
      }
    });
    return Object.values(map).map((m) => ({
      ...m,
      avatar: getInitials(m.name),
      conversionRate: m.leads > 0 ? Math.round((m.converted / m.leads) * 100) : 0,
      avgResponseTime: formatAvgResponse(m.responseDiffs),
    }));
  }, [filteredLeads]);
  const maxConvRate = Math.max(...teamPerformance.map((t) => t.conversionRate), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
        <div className="flex gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                period === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <div key={i} className="rounded-lg border bg-card p-5">
            <div className="text-xs font-medium text-muted-foreground">{m.label}</div>
            <div className="mt-1 font-display text-3xl font-bold text-foreground">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Leads Over Time */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="font-display text-sm font-semibold text-foreground">Leads Over Time</h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={leadsOverTime}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={period === "This Month" ? 4 : "preserveStartEnd"}
                />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time Distribution */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="font-display text-sm font-semibold text-foreground">
            Response Time Distribution
          </h3>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responseTimeData}>
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {responseTimeData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={
                        i < 2
                          ? "hsl(142, 71%, 45%)"
                          : i < 3
                          ? "hsl(38, 92%, 50%)"
                          : "hsl(0, 72%, 51%)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Funnel */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="font-display text-sm font-semibold text-foreground">Pipeline Funnel</h3>
          <div className="mt-4 space-y-3">
            {funnelData.map((stage, i) => {
              const width = (stage.value / funnelMax) * 100;
              return (
                <div key={i}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{stage.stage}</span>
                    <span className="font-medium text-foreground">{stage.value}</span>
                  </div>
                  <div className="h-8 rounded-md bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-md bg-primary/80 transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leads by Campaign */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="font-display text-sm font-semibold text-foreground">
            Leads by Campaign
          </h3>
          <div className="mt-4 space-y-3">
            {campaignData.map((c, i) => (
              <div key={i}>
                <div className="mb-1 flex justify-between text-xs gap-2">
                  <span className="text-muted-foreground truncate">{c.campaign}</span>
                  <span className="font-medium text-foreground shrink-0">
                    {c.leads} · {c.conversionRate}%
                  </span>
                </div>
                <div className="h-6 rounded-md bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-md bg-primary/70"
                    style={{ width: `${(c.leads / maxCampaignLeads) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="rounded-lg border bg-card">
        <div className="border-b px-5 py-4">
          <h3 className="font-display text-sm font-semibold text-foreground">Team Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                  Team Member
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">
                  Assigned
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">
                  Contacted
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">
                  Avg. Response
                </th>
                <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">
                  Conv. Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {teamPerformance.map((m, i) => {
                const isBest = m.conversionRate === maxConvRate && maxConvRate > 0;
                return (
                  <tr
                    key={i}
                    className={`border-b last:border-0 ${isBest ? "bg-success/5" : ""}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-semibold text-primary">
                          {m.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{m.name}</div>
                          <div className="text-xs text-muted-foreground">{m.role}</div>
                        </div>
                        {isBest && (
                          <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                            Top
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-foreground">{m.leads}</td>
                    <td className="px-5 py-3 text-right text-foreground">{m.contacted}</td>
                    <td className="px-5 py-3 text-right text-foreground">{m.avgResponseTime}</td>
                    <td className="px-5 py-3 text-right font-medium text-foreground">
                      {m.conversionRate}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
