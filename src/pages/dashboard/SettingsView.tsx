import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Clock, Upload } from "lucide-react";

const SettingsView = () => {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>

      {/* Profile */}
      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="font-display text-sm font-semibold text-foreground">Profile</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-bold text-primary">AM</div>
          <Button variant="outline" size="sm"><Upload className="mr-2 h-3 w-3" /> Change photo</Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input defaultValue="Alex Morgan" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input defaultValue="alex@metaleads.io" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input defaultValue="+1 (555) 123-4567" />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="font-display text-sm font-semibold text-foreground">Notifications</h2>
        {[
          { label: "New lead alerts", defaultOn: true },
          { label: "Lead aging warnings", defaultOn: true },
          { label: "Daily summary email", defaultOn: true },
          { label: "WhatsApp notifications", defaultOn: false },
        ].map(n => (
          <div key={n.label} className="flex items-center justify-between">
            <Label className="text-sm text-foreground">{n.label}</Label>
            <Switch defaultChecked={n.defaultOn} />
          </div>
        ))}
      </section>

      {/* Lead Source */}
      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="font-display text-sm font-semibold text-foreground">Lead Source</h2>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Google Sheets</span>
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success"><CheckCircle className="h-3 w-3" /> Connected</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Meta Ads</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Coming Soon</span>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Sync frequency</Label>
          <Select defaultValue="1">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Every 1 min</SelectItem>
              <SelectItem value="5">Every 5 min</SelectItem>
              <SelectItem value="15">Every 15 min</SelectItem>
              <SelectItem value="30">Every 30 min</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Integrations */}
      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="font-display text-sm font-semibold text-foreground">Integrations</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "Google Sheets", status: "Connected", active: true },
            { name: "Meta Ads", status: "Coming Soon", active: false },
            { name: "WhatsApp Business", status: "Coming Soon", active: false },
            { name: "Zapier", status: "Coming Soon", active: false },
          ].map(i => (
            <div key={i.name} className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm font-medium text-foreground">{i.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${i.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {i.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
