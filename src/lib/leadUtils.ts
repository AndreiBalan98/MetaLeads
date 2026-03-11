export const getTimeSince = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffDays > 0) return `${diffDays}d ${diffHr % 24}h`;
  if (diffHr > 0) return `${diffHr}h ${diffMin % 60}m`;
  if (diffMin > 0) return `${diffMin}m`;
  return `${diffSec}s`;
};

export const getUrgencyLevel = (date: Date): 'green' | 'yellow' | 'red' => {
  const now = new Date();
  const diffMin = (now.getTime() - date.getTime()) / 60000;
  if (diffMin < 5) return 'green';
  if (diffMin < 60) return 'yellow';
  return 'red';
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-info/10 text-info';
    case 'contacted': return 'bg-warning/10 text-warning';
    case 'qualified': return 'bg-success/10 text-success';
    case 'won': return 'bg-success/20 text-success';
    case 'lost': return 'bg-muted text-muted-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

export const getUrgencyColorClass = (level: 'green' | 'yellow' | 'red') => {
  switch (level) {
    case 'green': return 'text-success urgency-pulse-green';
    case 'yellow': return 'text-urgency';
    case 'red': return 'text-destructive urgency-pulse-red';
  }
};
