import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users as UsersIcon,
  GitBranch,
  BarChart3,
  Settings,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { searchLeads } from "@/lib/dataService";
import UrgencyClock from "@/components/UrgencyClock";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Leads", icon: UsersIcon, path: "/dashboard/leads" },
  { label: "Pipeline", icon: GitBranch, path: "/dashboard/pipeline" },
  { label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { label: "Team", icon: UsersIcon, path: "/dashboard/team" },
  { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const mobileNavItems = navItems.slice(0, 4);

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [] } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchLeads(searchQuery),
    enabled: searchQuery.trim().length > 1,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/dashboard" && location.pathname.startsWith(path));

  const notifDot = (type: string) => {
    if (type === "new") return "bg-success";
    if (type === "aging") return "bg-urgency";
    return "bg-info";
  };

  const handleSelectResult = (leadId: string) => {
    setSearchQuery("");
    setSearchOpen(false);
    navigate(`/dashboard/leads?lead=${leadId}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 flex-shrink-0 flex-col border-r bg-card lg:flex">
        <div className="flex h-16 items-center px-6">
          <span className="font-display text-xl font-bold text-foreground">
            Meta<span className="text-primary">Leads</span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-semibold text-primary">
              AB
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">Andrei Balan</div>
              <button
                onClick={() => navigate("/")}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r bg-card shadow-lg">
            <div className="flex h-16 items-center justify-between px-6">
              <span className="font-display text-xl font-bold text-foreground">
                Meta<span className="text-primary">Leads</span>
              </span>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-1 px-3 py-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 flex-shrink-0 items-center gap-3 border-b bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-display text-lg font-bold text-foreground lg:hidden">
            Meta<span className="text-primary">Leads</span>
          </span>

          {/* Search */}
          <div className="hidden flex-1 lg:block" ref={searchRef}>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads by name, phone, email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
              />
              {/* Search Dropdown */}
              {searchOpen && searchQuery.trim().length > 1 && (
                <div className="absolute top-full mt-1 w-full rounded-lg border bg-card shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No results found
                    </div>
                  ) : (
                    searchResults.map((lead) => (
                      <button
                        key={lead.id}
                        onClick={() => handleSelectResult(lead.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-accent transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground truncate">
                            {lead.lead_data.full_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {lead.lead_data.phone_number} · {lead.campaign_name}
                          </div>
                        </div>
                        <UrgencyClock submittedAt={lead.submittedAt} size="sm" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Button variant="ghost" size="icon" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell className="h-5 w-5" />
              </Button>
            </div>
            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-display text-xs font-semibold text-primary lg:flex">
              AB
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 lg:p-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t bg-card lg:hidden">
        {mobileNavItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
              isActive(item.path) ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardLayout;
