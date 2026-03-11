import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllLeads } from "@/lib/dataService";
import type { Lead } from "@/lib/dataService";
import UrgencyClock from "@/components/UrgencyClock";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

type PipelineStage = "NEW" | "CONTACTED" | "QUALIFIED" | "DISQUALIFIED" | "CONVERTED";

const stageConfig: { key: PipelineStage; label: string; colorClass: string }[] = [
  { key: "NEW", label: "New", colorClass: "bg-info" },
  { key: "CONTACTED", label: "Contacted", colorClass: "bg-warning" },
  { key: "QUALIFIED", label: "Qualified", colorClass: "bg-success" },
  { key: "DISQUALIFIED", label: "Disqualified", colorClass: "bg-muted-foreground" },
  { key: "CONVERTED", label: "Converted", colorClass: "bg-success" },
];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const PipelineView = () => {
  const { data: fetchedLeads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: getAllLeads,
  });

  // Local overrides for drag-and-drop (no persistence)
  const [stageOverrides, setStageOverrides] = useState<Record<string, PipelineStage>>({});

  const getEffectiveStage = (lead: Lead): PipelineStage =>
    stageOverrides[lead.id] ?? (lead.lead_status as PipelineStage);

  const getLeadsByStage = (stage: PipelineStage) =>
    fetchedLeads.filter((l) => getEffectiveStage(l) === stage);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const leadId = result.draggableId;
    const newStage = result.destination.droppableId.replace(
      "mobile-",
      ""
    ) as PipelineStage;
    setStageOverrides((prev) => ({ ...prev, [leadId]: newStage }));
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Pipeline</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Desktop: horizontal columns */}
        <div className="mt-4 hidden gap-3 lg:flex">
          {stageConfig.map((stage) => {
            const stageLeads = getLeadsByStage(stage.key);
            return (
              <div key={stage.key} className="flex-1 min-w-0">
                <div
                  className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 ${stage.colorClass}`}
                >
                  <span className="text-sm font-semibold text-primary-foreground">
                    {stage.label}
                  </span>
                  <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {stageLeads.length}
                  </span>
                </div>
                <Droppable droppableId={stage.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] space-y-2 rounded-b-lg border border-t-0 p-2 transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5" : "bg-muted/30"
                      }`}
                    >
                      {stageLeads.map((lead, i) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={i}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="rounded-md border bg-card p-3 shadow-sm"
                            >
                              <div className="font-medium text-sm text-foreground">
                                {lead.lead_data.full_name}
                              </div>
                              <div className="mt-1 flex items-center justify-between">
                                <UrgencyClock submittedAt={lead.submittedAt} size="sm" />
                                <div
                                  className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary"
                                  title={lead.assigned_to.name}
                                >
                                  {getInitials(lead.assigned_to.name)}
                                </div>
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                {lead.lead_data.phone_number}
                              </div>
                              <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                                {lead.campaign_name}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical accordion-style */}
        <div className="mt-4 space-y-3 lg:hidden">
          {stageConfig.map((stage) => {
            const stageLeads = getLeadsByStage(stage.key);
            return (
              <div key={stage.key}>
                <div
                  className={`flex items-center gap-2 rounded-t-lg px-4 py-2.5 ${stage.colorClass}`}
                >
                  <span className="text-sm font-semibold text-primary-foreground">
                    {stage.label}
                  </span>
                  <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    {stageLeads.length}
                  </span>
                </div>
                <Droppable droppableId={`mobile-${stage.key}`}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-2 rounded-b-lg border border-t-0 p-2 bg-muted/30"
                    >
                      {stageLeads.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="rounded-md border bg-card p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-foreground">
                              {lead.lead_data.full_name}
                            </span>
                            <UrgencyClock submittedAt={lead.submittedAt} size="sm" />
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {lead.lead_data.phone_number}
                          </div>
                        </div>
                      ))}
                      {stageLeads.length > 3 && (
                        <div className="text-center text-xs text-muted-foreground py-1">
                          +{stageLeads.length - 3} more
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default PipelineView;
