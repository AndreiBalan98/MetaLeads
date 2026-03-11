import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLeads, getTeamMembers, parseDateTime } from "@/lib/dataService";
import { Button } from "@/components/ui/button";
import { Mail, Phone, UserPlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const TeamView = () => {
  const [roundRobin, setRoundRobin] = useState(true);

  const { data: allLeads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: getAllLeads,
  });
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["teamMembers"],
    queryFn: getTeamMembers,
  });

  const memberStats = useMemo(() => {
    return teamMembers.map((m) => {
      const myLeads = allLeads.filter((l) => l.assigned_to.email === m.email);
      const converted = myLeads.filter((l) => l.lead_status === "CONVERTED").length;
      const conversionRate =
        myLeads.length > 0 ? Math.round((converted / myLeads.length) * 100) : 0;

      const diffs = myLeads
        .filter((l) => l.response_time)
        .map((l) => parseDateTime(l.response_time).getTime() - l.submittedAt.getTime())
        .filter((d) => d > 0);
      const avgMs = diffs.length > 0 ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 0;
      const avgMin = Math.floor(avgMs / 60000);
      const avgHr = Math.floor(avgMin / 60);
      const avgResponseTime =
        diffs.length === 0 ? "—" : avgHr > 0 ? `${avgHr}h ${avgMin % 60}m` : `${avgMin}m`;

      return { ...m, leadsAssigned: myLeads.length, conversionRate, avgResponseTime };
    });
  }, [allLeads, teamMembers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Team</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Invite Team Member
        </Button>
      </div>

      {/* Round Robin */}
      <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
        <Switch id="rr" checked={roundRobin} onCheckedChange={setRoundRobin} />
        <Label htmlFor="rr" className="text-sm font-medium text-foreground">
          Round-Robin Auto-Assignment
        </Label>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${
            roundRobin ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
          }`}
        >
          {roundRobin ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Team Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {memberStats.map((m) => (
          <div key={m.email} className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-display text-lg font-semibold text-primary">
                  {m.avatar}
                </div>
                {/* offline — no real-time data */}
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-muted-foreground" />
              </div>
              <div>
                <div className="font-display font-semibold text-foreground">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.role}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5" /> {m.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5" /> {m.phone}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t pt-4">
              <div className="text-center">
                <div className="font-display text-lg font-bold text-foreground">
                  {m.leadsAssigned}
                </div>
                <div className="text-[10px] text-muted-foreground">Assigned</div>
              </div>
              <div className="text-center">
                <div className="font-display text-lg font-bold text-foreground">
                  {m.conversionRate}%
                </div>
                <div className="text-[10px] text-muted-foreground">Conv.</div>
              </div>
              <div className="text-center">
                <div className="font-display text-lg font-bold text-foreground">
                  {m.avgResponseTime}
                </div>
                <div className="text-[10px] text-muted-foreground">Avg. Resp</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamView;
