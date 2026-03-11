export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "DISQUALIFIED" | "CONVERTED";

export interface AssignedTo {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Lead {
  id: string;
  created_time: string;
  campaign_name: string;
  platform: string;
  lead_data: Record<string, string>;
  lead_status: LeadStatus;
  response_time: string;
  returning_lead: string;
  assigned_to: AssignedTo;
  // computed from created_time
  submittedAt: Date;
}

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
}

let cache: Lead[] | null = null;

export function parseDateTime(s: string): Date {
  if (!s) return new Date(0);
  const [datePart, timePart] = s.split("_");
  return new Date(`${datePart}T${timePart}`);
}

async function fetchLeads(): Promise<Lead[]> {
  if (cache) return cache;
  const res = await fetch("/data.json");
  const raw: Omit<Lead, "submittedAt">[] = await res.json();
  cache = raw.map((l) => ({ ...l, submittedAt: parseDateTime(l.created_time) }));
  return cache;
}

export const getAllLeads = () => fetchLeads();

export const getLeadsToday = async (): Promise<Lead[]> => {
  const leads = await fetchLeads();
  const today = new Date();
  return leads.filter((l) => {
    const d = l.submittedAt;
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });
};

export const getLeadsThisWeek = async (): Promise<Lead[]> => {
  const leads = await fetchLeads();
  const since = new Date(Date.now() - 7 * 86400000);
  return leads.filter((l) => l.submittedAt >= since);
};

export const getUncalledLeads = async (): Promise<Lead[]> => {
  const leads = await fetchLeads();
  const since = new Date(Date.now() - 7 * 86400000);
  return leads.filter((l) => l.lead_status === "NEW" && l.submittedAt >= since);
};

export const searchLeads = async (query: string): Promise<Lead[]> => {
  if (!query.trim()) return [];
  const leads = await fetchLeads();
  const q = query.toLowerCase();
  return leads
    .filter(
      (l) =>
        Object.values(l.lead_data).some((v) => v.toLowerCase().includes(q)) ||
        l.campaign_name.toLowerCase().includes(q)
    )
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());
};

export const getAvgResponseTime = async (): Promise<string> => {
  const leads = await fetchLeads();
  const diffs = leads
    .filter((l) => l.response_time)
    .map((l) => parseDateTime(l.response_time).getTime() - l.submittedAt.getTime())
    .filter((d) => d > 0);
  if (diffs.length === 0) return "—";
  const avgMs = diffs.reduce((a, b) => a + b, 0) / diffs.length;
  const totalMin = Math.floor(avgMs / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${totalMin}m`;
};

export const getConversionRate = async (): Promise<number> => {
  const leads = await fetchLeads();
  if (leads.length === 0) return 0;
  const converted = leads.filter((l) => l.lead_status === "CONVERTED").length;
  return Math.round((converted / leads.length) * 100);
};

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const leads = await fetchLeads();
  const seen = new Map<string, TeamMember>();
  for (const lead of leads) {
    const at = lead.assigned_to;
    if (at && !seen.has(at.email)) {
      const parts = at.name.trim().split(/\s+/);
      const avatar =
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : at.name.slice(0, 2).toUpperCase();
      seen.set(at.email, { ...at, avatar });
    }
  }
  return Array.from(seen.values());
};

export const cleanLabel = (key: string): string =>
  key
    .replace(/[_-]/g, " ")
    .replace(/\?/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
