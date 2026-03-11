import { useQuery } from "@tanstack/react-query";
import {
  getAllLeads,
  getLeadsToday,
  getUncalledLeads,
  getAvgResponseTime,
  getConversionRate,
} from "@/lib/dataService";
import UrgencyClock from "@/components/UrgencyClock";
import { TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS: Record<string, string> = {
  NEW: "hsl(217, 91%, 60%)",
  CONTACTED: "hsl(38, 92%, 50%)",
  QUALIFIED: "hsl(142, 71%, 45%)",
  DISQUALIFIED: "hsl(215, 16%, 47%)",
  CONVERTED: "hsl(142, 71%, 35%)",
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DashboardHome = () => {
  const navigate = useNavigate();

  const { data: allLeads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: getAllLeads,
  });
  const { data: todayLeads = [] } = useQuery({
    queryKey: ["leadsToday"],
    queryFn: getLeadsToday,
  });
  const { data: uncalledLeads = [] } = useQuery({
    queryKey: ["uncalled"],
    queryFn: getUncalledLeads,
  });
  const { data: avgResponseTime = "—" } = useQuery({
    queryKey: ["avgResponse"],
    queryFn: getAvgResponseTime,
  });
  const { data: conversionRate = 0 } = useQuery({
    queryKey: ["conversionRate"],
    queryFn: getConversionRate,
  });

  // Top 5 oldest NEW leads
  const urgentLeads = allLeads
    .filter((l) => l.lead_status === "NEW")
    .sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime())
    .slice(0, 5);

  // Last 7 days bar chart
  const now = new Date();
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 86400000);
    return {
      day: DAY_LABELS[d.getDay()],
      leads: allLeads.filter((l) => {
        const ld = l.submittedAt;
        return (
          ld.getFullYear() === d.getFullYear() &&
          ld.getMonth() === d.getMonth() &&
          ld.getDate() === d.getDate()
        );
      }).length,
    };
  });

  // Pipeline pie — last 7 days
  const since = new Date(Date.now() - 7 * 86400000);
  const weekLeads = allLeads.filter((l) => l.submittedAt >= since);
  const pipelineData = (
    ["NEW", "CONTACTED", "QUALIFIED", "DISQUALIFIED", "CONVERTED"] as const
  )
    .map((s) => ({
      name: s.charAt(0) + s.slice(1).toLowerCase(),
      value: weekLeads.filter((l) => l.lead_status === s).length,
      color: STATUS_COLORS[s],
    }))
    .filter((d) => d.value > 0);

  const statCards = [
    {
      label: "New Leads Today",
      value: String(todayLeads.length),
      change: "Submitted today",
      positive: true,
    },
    {
      label: "Uncalled Leads",
      value: String(uncalledLeads.length),
      change: "Needs attention",
      positive: false,
    },
    {
      label: "Avg. Response Time",
      value: avgResponseTime,
      change: "Across responded leads",
      positive: true,
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      change: "Converted / total leads",
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <div key={i} className="rounded-lg border bg-card p-5">
            <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
            <div
              className={`mt-1 font-display text-3xl font-bold ${
                i === 1 ? "text-urgency" : "text-foreground"
              }`}
            >
              {s.value}
            </div>
            <div
              className={`mt-1 flex items-center gap-1 text-xs ${
                s.positive ? "text-success" : "text-urgency"
              }`}
            >
              {s.positive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* Urgent Leads */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Leads Needing Attention
          </h2>
          <button
            onClick={() => navigate("/dashboard/leads")}
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View all <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="divide-y">
          {urgentLeads.length === 0 ? (
            <div className="px-5 py-6 text-center text-sm text-muted-foreground">
              No leads needing attention
            </div>
          ) : (
            urgentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center gap-4 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {lead.lead_data.full_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lead.lead_data.phone_number}
                  </div>
                </div>
                <UrgencyClock submittedAt={lead.submittedAt} size="sm" />
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {lead.campaign_name}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="font-display text-sm font-semibold text-foreground">Leads This Week</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="leads" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <h3 className="font-display text-sm font-semibold text-foreground">Pipeline Summary</h3>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  {pipelineData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
