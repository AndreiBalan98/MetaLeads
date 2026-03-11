import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { getAllLeads, cleanLabel } from "@/lib/dataService";
import type { Lead } from "@/lib/dataService";
import UrgencyClock from "@/components/UrgencyClock";
import { Phone, MessageCircle, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["ALL", "NEW", "CONTACTED", "QUALIFIED", "DISQUALIFIED", "CONVERTED"] as const;

const statusColor = (s: string) => {
  switch (s) {
    case "NEW":
      return "bg-info/10 text-info";
    case "CONTACTED":
      return "bg-warning/10 text-warning";
    case "QUALIFIED":
      return "bg-success/10 text-success";
    case "DISQUALIFIED":
      return "bg-muted text-muted-foreground";
    case "CONVERTED":
      return "bg-success/20 text-success";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const LeadsView = () => {
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState("");

  const { data: allLeads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: getAllLeads,
  });

  // Auto-select lead from URL param (coming from global search)
  useEffect(() => {
    const leadId = new URLSearchParams(location.search).get("lead");
    if (leadId && allLeads.length > 0) {
      const found = allLeads.find((l) => l.id === leadId);
      if (found) setSelectedLead(found);
    }
  }, [location.search, allLeads]);

  // Filter out empty/invalid campaign names to avoid SelectItem value="" issues
  const campaigns = [...new Set(allLeads.map((l) => l.campaign_name).filter(Boolean))].sort();

  const filtered = allLeads
    .filter((l) => statusFilter === "ALL" || l.lead_status === statusFilter)
    .filter((l) => campaignFilter === "all" || l.campaign_name === campaignFilter)
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

  const isReturning = (lead: Lead) => lead.returning_lead !== "1x";

  return (
    <div className="relative">
      <h1 className="font-display text-2xl font-bold text-foreground">Leads</h1>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <Select value={campaignFilter} onValueChange={setCampaignFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaigns.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lead List */}
      <div
        className={`mt-4 space-y-2 transition-all ${
          selectedLead
            ? "lg:mr-[50%] lg:grayscale-[80%] lg:pointer-events-none"
            : ""
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading leads...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="text-4xl">🔍</div>
            <p className="mt-4 font-display text-lg font-semibold text-foreground">
              No leads match this filter
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map((lead, i) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="animate-fade-in-up cursor-pointer rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-semibold text-foreground">
                      {lead.lead_data.full_name}
                    </span>
                    {isReturning(lead) && (
                      <span className="rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
                        Returning — {lead.returning_lead}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {lead.lead_data.phone_number}
                  </div>
                  <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {lead.campaign_name}
                  </span>
                </div>
                <div className="hidden flex-col items-center gap-1 sm:flex">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(
                      lead.lead_status
                    )}`}
                  >
                    {lead.lead_status.charAt(0) + lead.lead_status.slice(1).toLowerCase()}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {lead.submittedAt.toLocaleDateString()}
                  </span>
                </div>
                <UrgencyClock submittedAt={lead.submittedAt} />
                <div className="flex gap-1">
                  <a
                    href={`tel:${lead.lead_data.phone_number}`}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <button
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-success"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slide-Over Panel */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto border-l bg-card shadow-xl animate-slide-in-right sm:w-96 lg:w-[50%]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card px-6 py-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              {selectedLead.lead_data.full_name}
            </h2>
            <Button variant="ghost" size="icon" onClick={() => setSelectedLead(null)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <div className="flex gap-3">
              <Button className="flex-1" asChild>
                <a href={`tel:${selectedLead.lead_data.phone_number}`}>
                  <Phone className="mr-2 h-4 w-4" /> Call
                </a>
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
              </Button>
            </div>

            {/* Status — read-only */}
            <div className="flex flex-wrap gap-2">
              {STATUSES.slice(1).map((s) => (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    selectedLead.lead_status === s
                      ? statusColor(s) + " ring-2 ring-primary/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </span>
              ))}
            </div>

            {/* Urgency */}
            <div className="text-center">
              <div className="text-xs font-medium text-muted-foreground">
                Time Since Submission
              </div>
              <UrgencyClock submittedAt={selectedLead.submittedAt} size="lg" />
            </div>

            {/* Lead Info */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-display text-sm font-semibold text-foreground">
                Lead Information
              </h3>
              {Object.entries(selectedLead.lead_data).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm gap-4">
                  <span className="text-muted-foreground shrink-0">{cleanLabel(key)}</span>
                  <span className="text-foreground font-medium text-right">{val}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Platform</span>
                <span className="text-foreground font-medium capitalize">
                  {selectedLead.platform}
                </span>
              </div>
              {isReturning(selectedLead) && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Returning Lead</span>
                  <span className="rounded-full bg-info/10 px-2 py-0.5 text-[10px] font-medium text-info">
                    {selectedLead.returning_lead}
                  </span>
                </div>
              )}
            </div>

            {/* Assigned To */}
            <div className="rounded-lg border p-4">
              <h3 className="font-display text-sm font-semibold text-foreground">Assignment</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Assigned to:{" "}
                <span className="font-medium text-foreground">
                  {selectedLead.assigned_to.name}
                </span>{" "}
                <span className="text-xs">({selectedLead.assigned_to.role})</span>
              </p>
            </div>

            {/* Notes & Call Log */}
            <div className="rounded-lg border p-4 space-y-3">
              <h3 className="font-display text-sm font-semibold text-foreground">
                Notes & Call Log
              </h3>
              <p className="text-sm text-muted-foreground">No interactions yet</p>
              <div className="flex gap-2 pt-2">
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
                <Button size="sm" variant="outline">
                  Add Note
                </Button>
                <Button size="sm" variant="outline">
                  Log Call
                </Button>
              </div>
            </div>

            {/* Quality Score — static */}
            <div className="rounded-lg border p-4">
              <h3 className="font-display text-sm font-semibold text-foreground">Lead Quality</h3>
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-5 w-5 ${s <= 3 ? "fill-warning text-warning" : "text-muted"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">3/5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsView;
