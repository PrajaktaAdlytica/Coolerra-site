import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { ButtonLink, ClaimTag, SectionIntro, SiteFooter, SiteHeader } from "../components/SiteShell.jsx";
import { MonitorInterface, OptimizeInterface, PredictInterface } from "../components/ProductInterfaces.jsx";
import { productData, resourceItems, solutionData } from "../data.js";

const visuals = {
  monitor: "/assets/visual/final/monitor-data-hall.png",
  optimize: "/assets/visual/final/optimize-capacity-cutaway.png",
  phase: "/assets/visual/final/phase-lens-detailed.png",
  phaseStudio: "/assets/visual/final/phase-lens-studio.png",
  predict: "/assets/visual/final/predict-headroom-layers.png",
  boundary: "/assets/visual/final/thermal-boundary-dark.png",
};

function PageShell({ children, darkHeader = false }) {
  return <div className="interior-page"><SiteHeader dark={darkHeader} />{children}<SiteFooter /></div>;
}

function InteriorHero({ eyebrow, title, body, dark = false, visual = visuals.phase, visualPosition = "center" }) {
  return (
    <section className={`interior-hero section-shell ${dark ? "section-shell--dark interior-hero--dark" : ""}`}>
      <div className="interior-hero__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{body}</p>
        <div className="interior-hero__actions"><ButtonLink href="/demo" light={dark}>Request a thermal discovery</ButtonLink><ButtonLink href="/platform" secondary light={dark}>Explore the platform</ButtonLink></div>
      </div>
      <div className="interior-hero__visual" aria-hidden="true">
        <img src={visual} alt="" style={{ objectPosition: visualPosition }} />
      </div>
    </section>
  );
}

export function PlatformPage() {
  return (
    <PageShell>
      <InteriorHero visual={visuals.phase} eyebrow="Coolerra Platform" title="One thermal operating model. Three ways to act." body="Monitor reveals the current state. Optimize turns imbalance into governed action. Predict prepares the facility for what comes next." />
      <section className="platform-sequence section-shell">
        {Object.entries(productData).map(([key, product], index) => (
          <article key={key}>
            <span>0{index + 1}</span><p className="eyebrow">{product.eyebrow}</p><h2>{product.title}</h2><p>{product.description}</p><a href={`/products/${key}`}>Explore {product.eyebrow}<ArrowRight size={15} /></a>
          </article>
        ))}
      </section>
      <section className="shared-model section-shell section-shell--dark">
        <SectionIntro dark eyebrow="Shared context" title="State, action, and forecast stay connected." body="A recommendation is only meaningful beside the condition that caused it, the constraint that governs it, and the outcome that follows." />
        <div className="model-flow"><span>Facility signals</span><ArrowRight /><span>Current state</span><ArrowRight /><span>Governed action</span><ArrowRight /><span>Measured outcome</span></div>
      </section>
    </PageShell>
  );
}

export function ProductPage({ productKey }) {
  const product = productData[productKey];
  const Interface = productKey === "monitor" ? MonitorInterface : productKey === "optimize" ? OptimizeInterface : PredictInterface;
  return (
    <PageShell>
      <InteriorHero visual={visuals[productKey]} eyebrow={product.eyebrow} title={product.title} body={product.description} />
      <section className="product-proof section-shell">
        <div className="product-proof__copy"><p className="eyebrow">Product evidence</p><h2>{product.question}</h2><p>{product.answer}</p><div className="tag-stack">{product.outcomes.map((outcome) => <ClaimTag key={outcome}>{outcome}</ClaimTag>)}</div></div>
        <Interface />
      </section>
      <section className="product-method section-shell section-shell--dark">
        <SectionIntro dark eyebrow="Operating sequence" title="A legible workflow from signal to decision." />
        <div className="method-steps">{["Connect approved telemetry", "Build the current thermal state", "Review condition and confidence", productKey === "predict" ? "Compare future scenarios" : productKey === "optimize" ? "Review and approve an action" : "Investigate the local event"].map((step, index) => <div key={step}><span>0{index + 1}</span><p>{step}</p></div>)}</div>
      </section>
    </PageShell>
  );
}

export function SolutionPage({ solutionKey }) {
  const solution = solutionData[solutionKey];
  return (
    <PageShell>
      <InteriorHero visual={solutionKey === "gpu-cloud" ? visuals.predict : solutionKey === "enterprise-server-rooms" ? visuals.optimize : visuals.monitor} eyebrow={solution.eyebrow} title={solution.title} body={solution.description} />
      <section className="solution-priorities section-shell">
        <SectionIntro eyebrow="Operating priorities" title="Start with the reality already inside the room." />
        <div>{solution.priorities.map((priority, index) => <article key={priority}><span>0{index + 1}</span><h3>{priority}</h3><p>Keep this condition visible beside thermal state, workload behavior, and operator decisions.</p></article>)}</div>
      </section>
      <section className="solution-path section-shell section-shell--dark">
        <SectionIntro dark eyebrow="Discovery path" title="Bring one room, pod, or cooling loop." body="A 30-minute technical discovery leads to a scoped data and pilot-readiness review. No performance promise is required to start." />
        <ButtonLink href="/demo" light>Request a technical conversation</ButtonLink>
      </section>
    </PageShell>
  );
}

const technologyRows = [
  ["Telemetry", "Facility, cooling, power, and workload signal categories are evaluated during discovery."],
  ["Current-state model", "Signals are aligned around time, topology, data quality, and operating context."],
  ["Decision boundary", "Recommendations remain beside constraints, approval state, and rollback context."],
  ["Forecast boundary", "Future states show uncertainty and scenario assumptions rather than deterministic claims."],
  ["Deployment", "Exact topology, hosting, protocols, and write boundaries require product confirmation."],
];

export function TechnologyPage() {
  return (
    <PageShell>
      <InteriorHero visual={visuals.boundary} eyebrow="Technology" title="A thermal operating layer designed around context." body="Coolerra is designed to align facility telemetry, workload behavior, operator decisions, and measured outcomes." />
      <section className="architecture section-shell">
        <SectionIntro eyebrow="Intended architecture" title="A clear boundary between signal, model, and action." />
        <div className="architecture-table">{technologyRows.map(([name, detail], index) => <div key={name}><span>0{index + 1}</span><strong>{name}</strong><p>{detail}</p></div>)}</div>
      </section>
    </PageShell>
  );
}

export function SecurityPage() {
  return (
    <PageShell darkHeader>
      <InteriorHero dark visual={visuals.boundary} eyebrow="Security and data handling" title="Trust begins with explicit boundaries." body="Security information will distinguish intended product principles from controls that require implementation and independent validation." />
      <section className="security-principles section-shell">
        <SectionIntro eyebrow="Product principles" title="Operator authority is part of the architecture." />
        <div>{["Least necessary access", "Visible read and write boundaries", "Role-aware approvals", "Auditable events and decisions", "Safe fallback and rollback planning", "Evidence before certification claims"].map((item) => <article key={item}><Check size={16} /><span>{item}</span></article>)}</div>
        <p className="security-boundary">Hosting regions, encryption controls, retention, tenancy, certifications, and exact deployment options will publish after product confirmation.</p>
      </section>
    </PageShell>
  );
}

export function PricingPage() {
  return (
    <PageShell>
      <InteriorHero visual={visuals.optimize} eyebrow="Pricing approach" title="Scope the thermal problem before the commercial model." body="Coolerra begins with technical discovery and a defined pilot boundary. Package prices are not published before product and delivery assumptions are confirmed." />
      <section className="pricing-path section-shell">
        <SectionIntro eyebrow="Engagement path" title="A commercial scope grounded in operating reality." />
        <div>{[
          ["01", "Technical discovery", "Facility type, cooling mix, telemetry environment, workload pattern, and primary objective."],
          ["02", "Data readiness", "Available signals, quality, topology, access boundaries, and success criteria."],
          ["03", "Pilot scope", "One room, pod, or cooling loop with a documented measurement method."],
          ["04", "Platform scope", "Commercial model shaped by confirmed product capability and deployment complexity."],
        ].map(([n, title, copy]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        <ButtonLink href="/demo">Request a scoped conversation</ButtonLink>
      </section>
    </PageShell>
  );
}

export function CompanyPage() {
  return (
    <PageShell>
      <InteriorHero visual={visuals.phaseStudio} eyebrow="Company" title="Cooling intelligence for Europe's AI infrastructure era." body="Coolerra is a Poland/EU product startup focused on the thermal operating layer for GPU-heavy data centers." />
      <section className="company-story section-shell">
        <div><p className="eyebrow">Why Coolerra</p><h2>Dense compute changes the role of cooling.</h2></div>
        <div><p>Cooling is no longer a background facility system. It increasingly shapes usable capacity, workload planning, operating risk, and infrastructure strategy.</p><p>Coolerra exists to make that relationship legible without hiding uncertainty or operator responsibility behind an AI claim.</p></div>
      </section>
      <section className="company-update section-shell" aria-labelledby="company-update-title">
        <p className="eyebrow">Portfolio update</p>
        <div>
          <h2 id="company-update-title">Coolerra joins the TipHub portfolio.</h2>
          <p>TipHub announced a $550K allocation to support Coolerra’s work across AI infrastructure for data centres.</p>
        </div>
        <a href="/news/tiphub-allocation">Read the announcement <ArrowRight size={16} aria-hidden="true" /></a>
      </section>
      <section className="company-values section-shell section-shell--dark">{["Evidence before claims", "Operator authority", "Technical legibility", "European product discipline"].map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3></article>)}</section>
    </PageShell>
  );
}

export function TipHubAnnouncementPage() {
  const facts = [
    ["Company", "Coolerra"],
    ["Sector", "AI infrastructure for data centres"],
    ["TipHub-announced allocation", "$550K"],
    ["Stage", "Early stage"],
    ["Scope", "Global"],
    ["Portfolio", "TipHub"],
  ];

  return (
    <PageShell>
      <main className="news-announcement">
        <header className="news-announcement__hero section-shell">
          <div className="news-announcement__headline">
            <p className="eyebrow">Portfolio announcement</p>
            <h1>TipHub announces a <em>$550K allocation</em> to Coolerra.</h1>
          </div>
          <aside className="news-announcement__summary" aria-label="Announcement summary">
            <span>Announced allocation</span>
            <strong>$550K</strong>
            <p>AI infrastructure for data centres</p>
          </aside>
        </header>

        <section className="news-announcement__body section-shell">
          <div className="news-announcement__intro">
            <p>Coolerra is joining the TipHub portfolio following a $550K TipHub-announced allocation. The partnership supports the company’s work across AI infrastructure for data centres.</p>
          </div>
          <div className="news-announcement__copy">
            <p>We are building Coolerra to address an important operating problem within AI infrastructure for data centres. TipHub’s early-stage, global perspective aligns with our ambition to turn a focused insight into durable infrastructure.</p>
            <p>The relationship extends beyond capital to company-building support across product, market development, talent, and future growth.</p>
          </div>
        </section>

        <section className="news-announcement__facts section-shell" aria-labelledby="announcement-facts-title">
          <div className="news-announcement__facts-heading">
            <p className="eyebrow">Announcement facts</p>
            <h2 id="announcement-facts-title">The allocation, in context.</h2>
          </div>
          <dl>
            {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </section>

        <section className="news-announcement__links section-shell" aria-label="Announcement links">
          <a href="https://tiphub-prototype-review.vercel.app/companies/coolerra" target="_blank" rel="noreferrer"><span>Official source</span><strong>Visit TipHub announcement</strong><ArrowUpRight aria-hidden="true" /></a>
          <a href="https://www.coolerra.com"><span>Company</span><strong>Visit Coolerra website</strong><ArrowUpRight aria-hidden="true" /></a>
        </section>

        <aside className="news-announcement__disclosure section-shell" aria-label="Allocation disclosure">
          <span>Disclosure</span>
          <p>The allocation displayed is information supplied and announced by TipHub. It does not independently represent the company’s total financing and may be updated if an official company disclosure differs.</p>
        </aside>
      </main>
    </PageShell>
  );
}

export function ResourcesPage() {
  return (
    <PageShell>
      <InteriorHero visual={visuals.predict} eyebrow="Resources" title="Technical thinking for a denser infrastructure era." body="Engineering notes, research context, and measurement methods for AI infrastructure operators." />
      <section className="resource-list section-shell">{resourceItems.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><p className="eyebrow">{item.type}</p><h2>{item.title}</h2><p>{item.detail}</p></div><button type="button" aria-label={`${item.title}, coming soon`}>Coming soon</button></article>)}</section>
    </PageShell>
  );
}

export function DemoPage() {
  return <PageShell><DemoForm /></PageShell>;
}

function DemoForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    setSending(true);
    window.setTimeout(() => { setSending(false); setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" }); }, 650);
  };
  return (
    <main className="demo-page section-shell">
      <div className="demo-page__visual" aria-hidden="true"><img src={visuals.monitor} alt="" /></div>
      <div className="demo-copy"><p className="eyebrow">Technical discovery</p><h1>Start with your thermal reality.</h1><p>Tell us about the facility, cooling mix, telemetry environment, and operating question. The next step is a 30-minute technical discovery followed by a scoped data and pilot-readiness review.</p><div className="demo-steps"><span><Check size={15} />30-minute technical discovery</span><span><Check size={15} />Scoped data-readiness review</span><span><Check size={15} />No performance promise required</span></div></div>
      {submitted ? (
        <div className="form-success" role="status"><ShieldCheck size={34} /><p className="eyebrow">Request recorded</p><h2>Thank you. The next step is technical.</h2><p>Your request has been captured in this prototype. In production, the Coolerra team will follow up through the work email provided to arrange the 30-minute discovery.</p><ButtonLink href="/">Return to homepage</ButtonLink></div>
      ) : (
        <form className="demo-form" onSubmit={submit}>
          <div className="form-grid">
            <Field label="Work email" name="email" type="email" required />
            <Field label="Name and role" name="nameRole" required />
            <Field label="Company" name="company" required />
            <Select label="Facility type" name="facility" values={["AI data center", "GPU cloud", "Colocation", "Enterprise GPU room"]} />
            <Field label="Region" name="region" required />
            <Select label="Current cooling mix" name="cooling" values={["Air", "Rear-door", "Direct-to-chip", "Immersion", "Hybrid"]} />
            <Select label="Approximate rack density" name="density" values={["Under 30 kW", "30–60 kW", "60–100 kW", "100–150 kW", "150 kW+"]} />
            <Field label="Number of sites or rooms" name="sites" type="number" min="1" />
            <Field label="BMS / DCIM / telemetry environment" name="telemetry" />
            <Select label="Primary objective" name="objective" values={["Visibility", "Efficiency", "Thermal risk", "Capacity", "Reporting"]} />
            <Select label="Target pilot window" name="window" values={["0–3 months", "3–6 months", "6–12 months", "Exploring"]} />
            <label className="field field--wide"><span>Optional architecture notes</span><textarea name="notes" rows="4" placeholder="Workload pattern, cooling constraint, or facility question" /></label>
          </div>
          <label className="consent"><input type="checkbox" required /><span>I agree that Coolerra may use this information to respond to this request. No marketing consent is pre-selected.</span></label>
          <button className="button form-submit" type="submit" disabled={sending}>{sending ? "Sending…" : "Send technical request"}<ArrowRight size={16} /></button>
        </form>
      )}
    </main>
  );
}

function Field({ label, ...props }) {
  return <label className="field"><span>{label}</span><input {...props} placeholder={label} /></label>;
}

function Select({ label, values, ...props }) {
  return <label className="field"><span>{label}</span><select {...props} required defaultValue=""><option value="" disabled>Select {label.toLowerCase()}</option>{values.map((value) => <option key={value}>{value}</option>)}</select></label>;
}

export function ContactPage() {
  return (
    <PageShell>
      <main className="contact-page section-shell"><div className="contact-page__visual" aria-hidden="true"><img src={visuals.boundary} alt="" /></div><div className="contact-page__copy"><p className="eyebrow">Contact Coolerra</p><h1>Start with the operating question.</h1><p>For product, pilot, company, and technical conversations, use the route that best matches what you need.</p></div><div className="contact-options"><a href="/demo"><ShieldCheck /><span><strong>Technical discovery</strong><small>Facility, telemetry, cooling, and pilot readiness</small></span><ArrowRight /></a><a href="mailto:hello@coolerra.com"><Mail /><span><strong>Company contact</strong><small>hello@coolerra.com</small></span><ArrowRight /></a><div><LockKeyhole /><span><strong>Location</strong><small>8936 Spring Way, Esch-sur-Alzette, ES 4015, Luxembourg · Phone: 584 191 204</small></span></div></div></main>
    </PageShell>
  );
}

export function SignInPage() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <PageShell>
      <main className="signin-page section-shell"><div className="signin-page__visual" aria-hidden="true"><img src={visuals.phase} alt="" /></div><div className="signin-context"><img src="/assets/brand/coolerra-mark-color.svg" alt="" /><p className="eyebrow">Customer workspace</p><h1>Return to the thermal operating state.</h1><p>Secure access for Coolerra product environments. Authentication is represented for design review; production identity is not connected.</p></div><form className="signin-form" onSubmit={(event) => { event.preventDefault(); setMessage("Authentication is not connected in this prototype."); }}><h2>Sign in</h2><p>Use your Coolerra workspace credentials.</p><Field label="Work email" name="email" type="email" required /><label className="field password-field"><span>Password</span><input name="password" type={visible ? "text" : "password"} required placeholder="Password" /><button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff /> : <Eye />}</button></label><button className="button form-submit" type="submit">Sign in<ArrowRight size={16} /></button><a href="/contact">Contact workspace support</a><p className="form-message" aria-live="polite">{message}</p></form></main>
    </PageShell>
  );
}

export function LegalPage({ type }) {
  const privacy = type === "privacy";
  return (
    <PageShell>
      <main className="legal-page section-shell"><p className="eyebrow">Legal</p><h1>{privacy ? "Privacy" : "Terms"}</h1><p className="legal-date">Draft website notice · July 2026</p><section><h2>{privacy ? "Information submitted through this website" : "Use of this website"}</h2><p>{privacy ? "The website may collect information that you submit through technical-discovery, contact, newsletter, and sign-in forms. Production data handling, retention, legal basis, subprocessors, and contact details require legal review before launch." : "This website presents a pre-launch product concept. Product capabilities, deployment options, integrations, pricing, and performance outcomes remain subject to confirmation in a written commercial agreement."}</p><h2>{privacy ? "Product and telemetry data" : "No performance guarantee"}</h2><p>{privacy ? "No customer telemetry is processed by this prototype. Any production processing terms will be documented separately before deployment." : "Illustrative product values and forecasts are demonstrations of interface intent. They are not customer outcomes or guarantees."}</p><h2>Contact</h2><p>Legal notices should be directed through the Coolerra contact page until the approved legal entity details are published.</p></section></main>
    </PageShell>
  );
}
