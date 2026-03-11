export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  campaign: string;
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
  submittedAt: Date;
  interestedIn: string;
  budgetRange: string;
  isDuplicate: boolean;
  duplicateCount?: number;
  assignedTo: string;
  qualityScore: number;
  notes: NoteEntry[];
  callLog: CallLogEntry[];
  history?: HistoryEntry[];
}

export interface NoteEntry {
  date: string;
  text: string;
}

export interface CallLogEntry {
  date: string;
  outcome: string;
  duration?: string;
  note?: string;
  calledBy: string;
}

export interface HistoryEntry {
  date: string;
  note: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar: string;
  leadsAssigned: number;
  leadsContacted: number;
  avgResponseTime: string;
  conversionRate: number;
  online: boolean;
}

export interface Notification {
  id: string;
  message: string;
  time: string;
  type: 'new' | 'aging' | 'duplicate';
}

const now = new Date();
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60000);
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

export const campaigns = [
  "Summer Sale 2024",
  "Free Consultation",
  "Webinar: Scaling Your Business",
  "Instagram — Home Renovation",
];

export const teamMembers: TeamMember[] = [
  { id: "tm1", name: "Alex Morgan", role: "Sales Manager", email: "alex@metaleads.io", phone: "+1 (555) 123-4567", avatar: "AM", leadsAssigned: 42, leadsContacted: 38, avgResponseTime: "2m 15s", conversionRate: 31, online: true },
  { id: "tm2", name: "Sofia Chen", role: "Sales Rep", email: "sofia@metaleads.io", phone: "+1 (555) 234-5678", avatar: "SC", leadsAssigned: 35, leadsContacted: 30, avgResponseTime: "3m 48s", conversionRate: 26, online: true },
  { id: "tm3", name: "Marcus Williams", role: "Sales Rep", email: "marcus@metaleads.io", phone: "+1 (555) 345-6789", avatar: "MW", leadsAssigned: 28, leadsContacted: 22, avgResponseTime: "5m 12s", conversionRate: 18, online: false },
  { id: "tm4", name: "Elena Popescu", role: "Sales Rep", email: "elena@metaleads.io", phone: "+40 722 345 678", avatar: "EP", leadsAssigned: 37, leadsContacted: 35, avgResponseTime: "1m 54s", conversionRate: 34, online: true },
  { id: "tm5", name: "David Kim", role: "Junior Sales Rep", email: "david@metaleads.io", phone: "+1 (555) 456-7890", avatar: "DK", leadsAssigned: 20, leadsContacted: 15, avgResponseTime: "8m 30s", conversionRate: 15, online: false },
];

export const leads: Lead[] = [
  {
    id: "l1", name: "Maria Garcia", phone: "+34 612 345 678", email: "maria.garcia@email.com", city: "Madrid",
    campaign: "Summer Sale 2024", status: "new", submittedAt: minutesAgo(0.5),
    interestedIn: "Premium Package", budgetRange: "€5,000 - €10,000", isDuplicate: false,
    assignedTo: "tm1", qualityScore: 5,
    notes: [], callLog: [],
  },
  {
    id: "l2", name: "John Smith", phone: "+1 (555) 987-6543", email: "john.smith@gmail.com", city: "Austin",
    campaign: "Free Consultation", status: "new", submittedAt: minutesAgo(2),
    interestedIn: "Business Consulting", budgetRange: "$2,000 - $5,000", isDuplicate: false,
    assignedTo: "tm2", qualityScore: 4,
    notes: [], callLog: [],
  },
  {
    id: "l3", name: "Ana López", phone: "+52 55 1234 5678", email: "ana.lopez@outlook.com", city: "Mexico City",
    campaign: "Instagram — Home Renovation", status: "new", submittedAt: minutesAgo(8),
    interestedIn: "Kitchen Renovation", budgetRange: "$10,000 - $20,000", isDuplicate: true, duplicateCount: 2,
    assignedTo: "tm1", qualityScore: 5,
    notes: [], callLog: [],
    history: [
      { date: "Jan 15, 2026", note: "First submitted — marked as 'Interested but not ready'" },
      { date: "Mar 8, 2026", note: "Second submission — Current" },
    ],
  },
  {
    id: "l4", name: "Andrei Ionescu", phone: "+40 731 234 567", email: "andrei.ionescu@yahoo.com", city: "Bucharest",
    campaign: "Webinar: Scaling Your Business", status: "new", submittedAt: minutesAgo(15),
    interestedIn: "Growth Strategy", budgetRange: "€1,000 - €3,000", isDuplicate: false,
    assignedTo: "tm4", qualityScore: 3,
    notes: [], callLog: [],
  },
  {
    id: "l5", name: "Sarah Johnson", phone: "+1 (555) 876-5432", email: "sarah.j@gmail.com", city: "New York",
    campaign: "Summer Sale 2024", status: "new", submittedAt: minutesAgo(42),
    interestedIn: "Standard Package", budgetRange: "$1,000 - $3,000", isDuplicate: false,
    assignedTo: "tm3", qualityScore: 4,
    notes: [], callLog: [],
  },
  {
    id: "l6", name: "Carlos Ruiz", phone: "+34 699 876 543", email: "carlos.ruiz@email.es", city: "Barcelona",
    campaign: "Free Consultation", status: "new", submittedAt: hoursAgo(1.5),
    interestedIn: "Marketing Audit", budgetRange: "€2,000 - €5,000", isDuplicate: false,
    assignedTo: "tm2", qualityScore: 3,
    notes: [], callLog: [],
  },
  {
    id: "l7", name: "Emma Wilson", phone: "+44 7700 123456", email: "emma.w@hotmail.com", city: "London",
    campaign: "Summer Sale 2024", status: "contacted", submittedAt: hoursAgo(3),
    interestedIn: "Premium Package", budgetRange: "£5,000 - £10,000", isDuplicate: false,
    assignedTo: "tm1", qualityScore: 4,
    notes: [{ date: "Mar 8, 3:15 PM", text: "Wants pricing for premium package" }],
    callLog: [
      { date: "Mar 8, 2:40 PM", outcome: "No Answer", calledBy: "Alex Morgan" },
      { date: "Mar 8, 3:15 PM", outcome: "Interested", duration: "4 min", note: "Interested, callback Thursday", calledBy: "Alex Morgan" },
    ],
  },
  {
    id: "l8", name: "Mihai Popa", phone: "+40 744 567 890", email: "mihai.popa@gmail.com", city: "Cluj-Napoca",
    campaign: "Webinar: Scaling Your Business", status: "contacted", submittedAt: hoursAgo(5),
    interestedIn: "SaaS Growth", budgetRange: "€3,000 - €7,000", isDuplicate: false,
    assignedTo: "tm4", qualityScore: 4,
    notes: [],
    callLog: [{ date: "Mar 8, 11:00 AM", outcome: "Callback Scheduled", note: "Call back Monday 10 AM", calledBy: "Elena Popescu" }],
  },
  {
    id: "l9", name: "Lisa Chen", phone: "+1 (555) 234-8765", email: "lisa.chen@company.com", city: "San Francisco",
    campaign: "Free Consultation", status: "contacted", submittedAt: daysAgo(1),
    interestedIn: "Business Consulting", budgetRange: "$5,000 - $10,000", isDuplicate: true, duplicateCount: 3,
    assignedTo: "tm2", qualityScore: 5,
    notes: [{ date: "Mar 7, 2:00 PM", text: "Very interested, high budget" }],
    callLog: [{ date: "Mar 7, 1:30 PM", outcome: "Interested", duration: "8 min", note: "Wants full proposal", calledBy: "Sofia Chen" }],
    history: [
      { date: "Dec 10, 2025", note: "First inquiry — downloaded whitepaper" },
      { date: "Feb 2, 2026", note: "Second inquiry — attended webinar" },
      { date: "Mar 7, 2026", note: "Third submission — Current" },
    ],
  },
  {
    id: "l10", name: "Roberto Fernández", phone: "+34 655 432 109", email: "roberto.f@email.com", city: "Valencia",
    campaign: "Instagram — Home Renovation", status: "contacted", submittedAt: daysAgo(1),
    interestedIn: "Bathroom Renovation", budgetRange: "€8,000 - €15,000", isDuplicate: false,
    assignedTo: "tm3", qualityScore: 3,
    notes: [],
    callLog: [{ date: "Mar 7, 4:00 PM", outcome: "Not Interested", note: "Too expensive, may reconsider", calledBy: "Marcus Williams" }],
  },
  {
    id: "l11", name: "Jennifer Park", phone: "+1 (555) 345-9876", email: "jen.park@gmail.com", city: "Chicago",
    campaign: "Summer Sale 2024", status: "qualified", submittedAt: daysAgo(2),
    interestedIn: "Enterprise Package", budgetRange: "$15,000 - $25,000", isDuplicate: false,
    assignedTo: "tm1", qualityScore: 5,
    notes: [{ date: "Mar 7, 10:00 AM", text: "Ready to sign, needs final approval from CEO" }],
    callLog: [
      { date: "Mar 6, 2:00 PM", outcome: "Interested", duration: "12 min", calledBy: "Alex Morgan" },
      { date: "Mar 7, 9:30 AM", outcome: "Interested", duration: "6 min", note: "Sending proposal today", calledBy: "Alex Morgan" },
    ],
  },
  {
    id: "l12", name: "Oana Dumitrescu", phone: "+40 755 678 901", email: "oana.d@yahoo.ro", city: "Timișoara",
    campaign: "Webinar: Scaling Your Business", status: "qualified", submittedAt: daysAgo(3),
    interestedIn: "Scale-Up Mentoring", budgetRange: "€5,000 - €10,000", isDuplicate: false,
    assignedTo: "tm4", qualityScore: 4,
    notes: [],
    callLog: [{ date: "Mar 5, 3:00 PM", outcome: "Interested", duration: "15 min", note: "Wants 3-month program", calledBy: "Elena Popescu" }],
  },
  {
    id: "l13", name: "Michael Brown", phone: "+1 (555) 456-1234", email: "m.brown@email.com", city: "Denver",
    campaign: "Free Consultation", status: "qualified", submittedAt: daysAgo(3),
    interestedIn: "Marketing Strategy", budgetRange: "$3,000 - $7,000", isDuplicate: false,
    assignedTo: "tm2", qualityScore: 4,
    notes: [],
    callLog: [{ date: "Mar 5, 11:00 AM", outcome: "Interested", duration: "10 min", calledBy: "Sofia Chen" }],
  },
  {
    id: "l14", name: "Laura Martínez", phone: "+34 677 890 123", email: "laura.m@gmail.com", city: "Seville",
    campaign: "Summer Sale 2024", status: "won", submittedAt: daysAgo(4),
    interestedIn: "Premium Package", budgetRange: "€7,000 - €12,000", isDuplicate: false,
    assignedTo: "tm1", qualityScore: 5,
    notes: [{ date: "Mar 5, 4:00 PM", text: "Contract signed!" }],
    callLog: [{ date: "Mar 4, 10:00 AM", outcome: "Interested", duration: "20 min", calledBy: "Alex Morgan" }],
  },
  {
    id: "l15", name: "David Nguyen", phone: "+1 (555) 567-2345", email: "d.nguyen@email.com", city: "Seattle",
    campaign: "Free Consultation", status: "won", submittedAt: daysAgo(5),
    interestedIn: "Full Audit", budgetRange: "$8,000 - $15,000", isDuplicate: false,
    assignedTo: "tm2", qualityScore: 5,
    notes: [],
    callLog: [{ date: "Mar 3, 2:00 PM", outcome: "Interested", duration: "25 min", calledBy: "Sofia Chen" }],
  },
  {
    id: "l16", name: "Cristina Radu", phone: "+40 766 789 012", email: "cristina.r@gmail.com", city: "Iași",
    campaign: "Webinar: Scaling Your Business", status: "won", submittedAt: daysAgo(5),
    interestedIn: "Growth Program", budgetRange: "€4,000 - €8,000", isDuplicate: false,
    assignedTo: "tm4", qualityScore: 4,
    notes: [],
    callLog: [{ date: "Mar 3, 4:00 PM", outcome: "Interested", duration: "18 min", calledBy: "Elena Popescu" }],
  },
  {
    id: "l17", name: "James Taylor", phone: "+44 7911 234567", email: "james.t@outlook.com", city: "Manchester",
    campaign: "Instagram — Home Renovation", status: "won", submittedAt: daysAgo(6),
    interestedIn: "Full Home Renovation", budgetRange: "£20,000 - £40,000", isDuplicate: false,
    assignedTo: "tm3", qualityScore: 5,
    notes: [],
    callLog: [{ date: "Mar 2, 11:00 AM", outcome: "Interested", duration: "30 min", calledBy: "Marcus Williams" }],
  },
  {
    id: "l18", name: "Priya Sharma", phone: "+91 98765 43210", email: "priya.s@email.com", city: "Mumbai",
    campaign: "Summer Sale 2024", status: "won", submittedAt: daysAgo(6),
    interestedIn: "Standard Package", budgetRange: "₹200,000 - ₹500,000", isDuplicate: false,
    assignedTo: "tm5", qualityScore: 4,
    notes: [],
    callLog: [{ date: "Mar 2, 3:00 PM", outcome: "Interested", duration: "15 min", calledBy: "David Kim" }],
  },
  {
    id: "l19", name: "Tom Henderson", phone: "+1 (555) 678-3456", email: "tom.h@company.com", city: "Portland",
    campaign: "Free Consultation", status: "lost", submittedAt: daysAgo(5),
    interestedIn: "Business Review", budgetRange: "$1,000 - $2,000", isDuplicate: false,
    assignedTo: "tm3", qualityScore: 2,
    notes: [{ date: "Mar 4, 2:00 PM", text: "Budget too low, went with competitor" }],
    callLog: [{ date: "Mar 3, 10:00 AM", outcome: "Not Interested", calledBy: "Marcus Williams" }],
  },
  {
    id: "l20", name: "Yuki Tanaka", phone: "+81 90-1234-5678", email: "yuki.t@email.jp", city: "Tokyo",
    campaign: "Webinar: Scaling Your Business", status: "lost", submittedAt: daysAgo(7),
    interestedIn: "International Expansion", budgetRange: "¥500,000 - ¥1,000,000", isDuplicate: false,
    assignedTo: "tm5", qualityScore: 2,
    notes: [],
    callLog: [{ date: "Mar 1, 8:00 AM", outcome: "Wrong Number", calledBy: "David Kim" }],
  },
];

export const notifications: Notification[] = [
  { id: "n1", message: "New lead: Maria Garcia", time: "30 seconds ago", type: "new" },
  { id: "n2", message: "Lead aging alert: John Smith hasn't been contacted in 2 hours", time: "5 minutes ago", type: "aging" },
  { id: "n3", message: "Duplicate detected: returning lead — Ana López", time: "8 minutes ago", type: "duplicate" },
];

export const weeklyLeadsData = [
  { day: "Mon", leads: 8 },
  { day: "Tue", leads: 12 },
  { day: "Wed", leads: 6 },
  { day: "Thu", leads: 15 },
  { day: "Fri", leads: 10 },
  { day: "Sat", leads: 4 },
  { day: "Sun", leads: 3 },
];

export const pipelineData = [
  { name: "New", value: 6, color: "hsl(217, 91%, 60%)" },
  { name: "Contacted", value: 4, color: "hsl(38, 92%, 50%)" },
  { name: "Qualified", value: 3, color: "hsl(142, 71%, 45%)" },
  { name: "Won", value: 5, color: "hsl(142, 71%, 35%)" },
  { name: "Lost", value: 2, color: "hsl(215, 16%, 47%)" },
];

export const dailyLeadsData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(now.getTime() - (29 - i) * 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  leads: Math.floor(Math.random() * 12) + 2,
}));

export const responseTimeData = [
  { range: "< 1 min", count: 28 },
  { range: "1-5 min", count: 45 },
  { range: "5-30 min", count: 32 },
  { range: "30-60 min", count: 18 },
  { range: "> 1 hr", count: 19 },
];

export const funnelData = [
  { stage: "Leads", value: 142 },
  { stage: "Contacted", value: 124 },
  { stage: "Qualified", value: 68 },
  { stage: "Won", value: 33 },
];

export const campaignData = [
  { campaign: "Summer Sale 2024", leads: 52, conversionRate: 28 },
  { campaign: "Free Consultation", leads: 38, conversionRate: 21 },
  { campaign: "Webinar: Scaling", leads: 30, conversionRate: 23 },
  { campaign: "IG — Home Reno", leads: 22, conversionRate: 18 },
];
