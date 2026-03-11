import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Phone, Copy, GitBranch, Users, BarChart3, ArrowRight, Star, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const features = [
  { icon: Clock, title: "Urgency Clock", desc: "See exactly how old each lead is. Green, yellow, red. Act before it's too late." },
  { icon: Phone, title: "One-Tap Calling", desc: "Click to call or WhatsApp any lead instantly from desktop or mobile." },
  { icon: Copy, title: "Duplicate Detection", desc: "Know if someone submitted a lead before. See their full history." },
  { icon: GitBranch, title: "Smart Pipeline", desc: "Drag leads through stages: New → Contacted → Qualified → Won/Lost." },
  { icon: Users, title: "Team Management", desc: "Assign leads, track who's calling, see team performance." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Leads per day, response times, conversion rates — all in one view." },
];

const stats = [
  { number: "80%", text: "of leads go cold after 5 minutes" },
  { number: "73%", text: "of leads are never contacted" },
  { number: "391%", text: "more conversions when you respond in under 1 minute" },
];

const testimonials = [
  { name: "Carlos Mendez", role: "Sales Director", company: "GrowthForce", quote: "We went from 45-minute response times to under 2 minutes. Our close rate doubled in the first month." },
  { name: "Rachel Kim", role: "Founder", company: "HomeStyle Renovations", quote: "MetaLeads is the only CRM my team actually uses. It's so simple there's nothing to learn." },
  { name: "Bogdan Vasile", role: "Marketing Manager", company: "TechScale EU", quote: "The urgency clock changed everything. Our reps compete to be the fastest caller now." },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <span className="font-display text-xl font-bold text-foreground">Meta<span className="text-primary">Leads</span></span>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Log In</Button>
            <Button size="sm" onClick={() => navigate("/login")}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center lg:py-32">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
        >
          Stop Losing Leads.<br />Start Closing Them.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          MetaLeads helps you call your Facebook & Instagram leads in seconds, not hours. The lightweight CRM built for speed.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button size="lg" className="px-8" onClick={() => navigate("/login")}>
            Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="px-8" onClick={() => {
            document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
          }}>
            See How It Works
          </Button>
        </motion.div>

        {/* Hero mockup placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-lg border bg-card shadow-xl"
        >
          <div className="flex h-8 items-center gap-2 border-b bg-muted px-4">
            <div className="h-3 w-3 rounded-full bg-destructive/50" />
            <div className="h-3 w-3 rounded-full bg-warning/50" />
            <div className="h-3 w-3 rounded-full bg-success/50" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-4 gap-4">
              {["12", "5", "4m 32s", "23%"].map((val, i) => (
                <div key={i} className="rounded-lg border bg-card p-4 text-center">
                  <div className="font-display text-2xl font-bold text-foreground">{val}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {["New Today", "Uncalled", "Avg Response", "Conv. Rate"][i]}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {["Maria Garcia — 30s ago", "John Smith — 2m ago", "Ana López — 8m ago"].map((l, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm font-medium text-foreground">{l.split(" — ")[0]}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${i === 0 ? 'bg-success/10 text-success' : i === 1 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {l.split(" — ")[1]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problem */}
      <section className="border-t bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">Every Minute Costs You Money</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border bg-background p-8 text-center"
              >
                <div className="font-display text-4xl font-bold text-primary">{s.number}</div>
                <p className="mt-3 text-muted-foreground">{s.text}</p>
              </motion.div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-muted-foreground">
            Most businesses lose leads because they're buried in spreadsheets, CSVs, and Meta Business Suite. MetaLeads puts every lead one tap away.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">Everything You Need. Nothing You Don't.</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border bg-card p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t bg-card py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              "Connect your Google Sheet or Meta account",
              "Get instant notifications when new leads arrive",
              "Call, track, and close — all in one place",
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <p className="mt-4 font-medium text-foreground">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">Trusted by Sales Teams</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="rounded-lg border bg-card p-6"
              >
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 fill-warning text-warning" />)}
                </div>
                <p className="mt-4 text-sm text-foreground">"{t.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-semibold text-primary">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}, {t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-card py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">Ready to stop losing leads?</h2>
          <p className="mt-4 text-muted-foreground">Start your free trial today. No credit card required.</p>
          <Button size="lg" className="mt-8 px-10" onClick={() => navigate("/login")}>
            Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 md:flex-row md:justify-between">
          <span className="font-display text-lg font-bold text-foreground">Meta<span className="text-primary">Leads</span></span>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {["Product", "Pricing", "About", "Contact", "Privacy", "Terms"].map(l => (
              <a key={l} href="#" className="transition-colors hover:text-foreground">{l}</a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">© 2026 MetaLeads. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
