import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { SiteHeader, SiteFooter, ButtonLink, ClaimTag, SectionIntro } from "../components/SiteShell.jsx";
import { ThermalScene } from "../components/ThermalScene.jsx";
import { EntryMotionMedia } from "../components/EntryMotionMedia.jsx";
import { MonitorInterface, OptimizeInterface, PredictInterface } from "../components/ProductInterfaces.jsx";
import { solutionLinks } from "../data.js";

gsap.registerPlugin(ScrollTrigger);

const productViews = [
  {
    name: "Monitor",
    index: "01",
    eyebrow: "Current state",
    title: "See the operating state, not just the alarms.",
    body: "A continuous thermal map aligns facility signals with workload behavior, so teams can distinguish noise from a condition that needs attention.",
    tags: ["Thermal topology", "Sensor confidence", "Event history"],
    Interface: MonitorInterface,
  },
  {
    name: "Optimize",
    index: "02",
    eyebrow: "Governed action",
    title: "Turn imbalance into a decision operators can inspect.",
    body: "The proposal, expected effect, safety envelope, approval state, and rollback path stay visible together.",
    tags: ["Visible guardrails", "Operator approval", "Rollback path"],
    Interface: OptimizeInterface,
  },
  {
    name: "Predict",
    index: "03",
    eyebrow: "Future state",
    title: "See the next thermal state before the workload arrives.",
    body: "Forecast upcoming density, airflow stress, and recovery time against the facility's current operating state, with uncertainty left visible.",
    tags: ["Workload-aware", "Uncertainty visible", "Scenario comparison"],
    Interface: PredictInterface,
  },
];

const trustRows = [
  ["01", "Recommendation", "A proposed change stays tied to a specific condition and expected result."],
  ["02", "Constraints", "Thermal and equipment boundaries remain readable beside the proposal."],
  ["03", "Approval", "The accountable operator sees the state before anything is published."],
  ["04", "Rollback", "The prior operating state and reversal path remain available."],
  ["05", "Audit", "Inputs, decisions, and measured outcomes form a reviewable record."],
];

const audiences = [
  { label: "AI Data Centers", detail: "Coordinate cooling response with fast-changing GPU density.", priorities: ["High-density pods", "Air and liquid domains", "Capacity headroom"] },
  { label: "GPU Cloud", detail: "Prepare facilities for scheduled workload concentration.", priorities: ["Load ramps", "Facility readiness", "Scenario planning"] },
  { label: "Colocation", detail: "Give facility teams a consistent view across diverse halls.", priorities: ["Mixed tenants", "Hall comparison", "Operating consistency"] },
  { label: "Enterprise", detail: "Bring thermal context to constrained rooms and local teams.", priorities: ["Retrofit estates", "Limited telemetry", "Pilot readiness"] },
];

const testimonials = [
  {
    quote: "The useful view is not another temperature chart. It is knowing which condition changed, what it affects, and what the team can safely do next.",
    name: "Michał Zieliński",
    role: "Data center operations lead",
  },
  {
    quote: "When GPU demand moves quickly, room averages arrive too late. We need thermal context that follows the workload and preserves operator control.",
    name: "Zofia Nowak",
    role: "AI infrastructure engineer",
  },
  {
    quote: "A recommendation only becomes operational when the constraint, expected effect, approval, and rollback path are visible together.",
    name: "Anna Kowalska",
    role: "Critical facilities manager",
  },
];

function StoryReading({ label, value, tone = "cryo" }) {
  return <div className={`story-reading story-reading--${tone}`}><span>{label}</span><strong>{value}</strong></div>;
}

export function HomePage() {
  const root = useRef(null);
  const entryRef = useRef(null);
  const storyRef = useRef(null);
  const sceneProgress = useRef(0);
  const invalidateScene = useRef(null);
  const [productView, setProductView] = useState(0);
  const [audience, setAudience] = useState(0);
  const ActiveInterface = productViews[productView].Interface;

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const beats = gsap.utils.toArray(".story-beat");

      ScrollTrigger.create({
        trigger: entryRef.current,
        start: "top top",
        end: "bottom top",
        onEnter: () => root.current?.classList.add("is-entry-dark"),
        onEnterBack: () => root.current?.classList.add("is-entry-dark"),
        onLeave: () => root.current?.classList.remove("is-entry-dark"),
      });

      if (!reduced) {
        gsap.from(".entry-prologue__copy > *", {
          opacity: 0,
          y: 24,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
        });
        gsap.from(".entry-prologue__rail > *", {
          opacity: 0,
          y: 14,
          duration: 0.8,
          delay: 0.45,
          stagger: 0.08,
          ease: "power3.out",
        });
        gsap.to(".entry-prologue__media", {
          scale: 1.1,
          yPercent: -2,
          ease: "none",
          scrollTrigger: { trigger: entryRef.current, start: "top top", end: "bottom top", scrub: 0.55 },
        });
        gsap.to(".entry-prologue__copy", {
          opacity: 0,
          y: -72,
          ease: "none",
          scrollTrigger: { trigger: entryRef.current, start: "38% top", end: "76% top", scrub: true },
        });
        gsap.to(".entry-prologue__rail", {
          opacity: 0,
          y: 28,
          ease: "none",
          scrollTrigger: { trigger: entryRef.current, start: "48% top", end: "82% top", scrub: true },
        });
      }

      ScrollTrigger.create({
        trigger: storyRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: reduced ? false : 0.45,
        onUpdate: (self) => {
          sceneProgress.current = self.progress * 6;
          invalidateScene.current?.();
          root.current?.style.setProperty("--story-progress", self.progress);
        },
      });

      ScrollTrigger.create({
        trigger: ".story-beat--boundary",
        start: "top 58%",
        end: "bottom top",
        onEnter: () => root.current?.classList.add("is-story-dark"),
        onEnterBack: () => root.current?.classList.add("is-story-dark"),
        onLeave: () => root.current?.classList.remove("is-story-dark"),
        onLeaveBack: () => root.current?.classList.remove("is-story-dark"),
      });

      beats.forEach((beat, index) => {
        const content = beat.querySelector(".story-beat__content");
        if (reduced) return;
        gsap.fromTo(content,
          { autoAlpha: index === 0 ? 1 : 0, y: index === 0 ? 0 : 72 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: beat, start: "top 66%", end: "top 42%", scrub: true },
          },
        );
        if (index < beats.length - 1) {
          gsap.to(content, {
            autoAlpha: 0,
            y: -48,
            ease: "none",
            scrollTrigger: { trigger: beat, start: "bottom 92%", end: "bottom 76%", scrub: true },
          });
        }
      });

      if (!reduced) {
        gsap.utils.toArray(".reveal").forEach((element) => {
          gsap.from(element, {
            scrollTrigger: { trigger: element, start: "top 84%", once: true },
            opacity: 0,
            y: 36,
            duration: 0.9,
            ease: "power3.out",
          });
        });
      }
    }, root);
    return () => context.revert();
  }, []);

  return (
    <div ref={root} className="homepage homepage--cinematic is-entry-dark">
      <SiteHeader />
      <main>
        <section ref={entryRef} className="entry-prologue" aria-labelledby="entry-title">
          <div className="entry-prologue__stage">
            <EntryMotionMedia />
            <div className="entry-prologue__copy shell">
              <p className="entry-prologue__eyebrow">Coolerra / Thermal intelligence</p>
              <h1 id="entry-title">AI compute moves.<br /><em>Cooling moves with it.</em></h1>
              <p>See the thermal state, improve cooling response, and prepare infrastructure for the next GPU workload.</p>
              <div className="entry-prologue__actions">
                <a className="entry-prologue__primary" href="#operating-story">Enter the thermal field <ArrowRight size={16} /></a>
                <a className="entry-prologue__secondary" href="/demo">Request an assessment</a>
              </div>
            </div>
            <div className="entry-prologue__rail shell" aria-label="Coolerra operating sequence">
              <div><span>01 / Observe</span><strong>Live thermal state</strong><small>27.3°C</small></div>
              <div><span>02 / Decide</span><strong>Controlled response</strong><small>22.1°C</small></div>
              <div><span>03 / Prepare</span><strong>Forecast headroom</strong><small>18.6°C</small></div>
              <a href="#operating-story"><span />Scroll to enter</a>
            </div>
          </div>
        </section>

        <section ref={storyRef} id="operating-story" className="cinematic-story" aria-label="Coolerra operating story">
          <div className="story-scene-rail"><ThermalScene progressRef={sceneProgress} invalidateRef={invalidateScene} /></div>
          <div className="story-progress" aria-hidden="true"><span /></div>

          <article className="story-beat story-beat--hero" data-story-step="0">
            <div className="story-beat__content">
              <p className="eyebrow">Thermal intelligence / Dense compute</p>
              <h1>Thermal intelligence,<br />made tangible.</h1>
              <p className="story-lede">See heat, improve cooling, and anticipate the next workload across air, liquid, and hybrid infrastructure.</p>
              <div className="hero-actions">
                <ButtonLink href="/demo">Request a thermal assessment</ButtonLink>
                <ButtonLink href="/platform" secondary>Explore the platform</ButtonLink>
              </div>
              <div className="story-signal-row">
                <StoryReading label="Monitor" value="27.3°C" tone="green" />
                <StoryReading label="Optimize" value="22.1°C" tone="cryo" />
                <StoryReading label="Predict" value="18.6°C" tone="heat" />
              </div>
              <a className="scroll-cue" href="#story-monitor"><span />Scroll to enter the thermal field</a>
            </div>
          </article>

          <article className="story-beat story-beat--density story-beat--right" data-story-step="1">
            <div className="story-beat__content">
              <p className="eyebrow">02 / Density shift</p>
              <h2>Every GPU changes the thermal state.</h2>
              <p>Power ramps arrive faster than room averages can explain. Airflow, coolant loops, rack density, and workload timing now move together.</p>
              <div className="story-data-lines">
                <StoryReading label="Workload pulse" value="03:14:07" tone="heat" />
                <StoryReading label="Local inlet delta" value="+1.8°C" tone="heat" />
                <StoryReading label="Room average" value="22.4°C" tone="cryo" />
              </div>
            </div>
          </article>

          <article className="story-beat story-beat--monitor" id="story-monitor" data-story-step="2">
            <div className="story-beat__content">
              <p className="eyebrow">03 / Coolerra Monitor</p>
              <h2>Make thermal headroom operational.</h2>
              <p>The field acquires coordinates, live values, confidence, anomalies, and event history. Operators see the state, not another wall of alarms.</p>
              <div className="story-data-lines">
                <StoryReading label="Aisle cold 03" value="19.3°C" tone="cryo" />
                <StoryReading label="Hotspot 01" value="42.7°C" tone="heat" />
                <StoryReading label="Sensor confidence" value="96.8%" tone="green" />
              </div>
              <a className="text-link" href="/products/monitor">Open Coolerra Monitor <ArrowRight size={15} /></a>
            </div>
          </article>

          <article className="story-beat story-beat--capacity" data-story-step="3">
            <div className="story-beat__content">
              <p className="eyebrow">04 / Coolerra Optimize</p>
              <h2>Create room for more compute.</h2>
              <p>A constrained control volume makes current load, available headroom, the proposed action, and its safe operating boundary visible together.</p>
              <div className="story-state-sequence" aria-label="Governed optimization sequence">
                <span>Current</span><i /><span>Proposed</span><i /><span>Approved</span><i /><span>Verified</span>
              </div>
              <a className="text-link" href="/products/optimize">Open Coolerra Optimize <ArrowRight size={15} /></a>
            </div>
          </article>

          <article className="story-beat story-beat--predict" data-story-step="4">
            <div className="story-beat__content">
              <p className="eyebrow">05 / Coolerra Predict</p>
              <h2>See how much thermal headroom remains.</h2>
              <p>Now, likely, and stress states remain separate. Forecast pressure is visible without pretending uncertainty has disappeared.</p>
              <div className="story-data-lines">
                <StoryReading label="Observed state" value="Now" tone="cryo" />
                <StoryReading label="Available headroom" value="18 min" tone="green" />
                <StoryReading label="Forecast pressure" value="18%" tone="heat" />
              </div>
              <a className="text-link" href="/products/predict">Open Coolerra Predict <ArrowRight size={15} /></a>
            </div>
          </article>

          <article className="story-beat story-beat--system story-beat--right" data-story-step="5">
            <div className="story-beat__content">
              <p className="eyebrow">06 / One thermal model</p>
              <h2>Observe. Decide. Prepare.</h2>
              <p>Monitor coordinates lock to Optimize actions. Measured outcomes update Predict. Three products become one continuous operating context.</p>
              <div className="story-segments" aria-label="Coolerra product sequence"><span>Monitor</span><span>Optimize</span><span>Predict</span></div>
            </div>
          </article>

          <article className="story-beat story-beat--boundary story-beat--dark" data-story-step="6">
            <div className="story-beat__content">
              <p className="eyebrow">07 / The operating boundary</p>
              <h2>Operate at the <em>boundary</em> of heat and control.</h2>
              <p>Observed conditions, governed interventions, and predicted states meet in one place, while operator authority stays visible.</p>
              <div className="boundary-legend"><span>Observed</span><span>Controlled</span><span>Predicted</span></div>
              <ButtonLink href="/demo" light>Bring us one room or cooling loop</ButtonLink>
            </div>
          </article>
        </section>

        <section className="product-lab section-shell">
          <div className="product-lab__header reveal">
            <p className="eyebrow">The operating desk</p>
            <h2>From thermal field to operator decision.</h2>
            <p>Inspect the product concept in its resting state. Values are illustrative; the interactions are real.</p>
          </div>
          <div className="product-lab__tabs" role="tablist" aria-label="Coolerra products">
            {productViews.map((product, index) => (
              <button key={product.name} type="button" role="tab" aria-selected={productView === index} onClick={() => setProductView(index)}>
                <span>{product.index}</span><strong>{product.name}</strong><small>{product.eyebrow}</small>
              </button>
            ))}
          </div>
          <div className="product-lab__body" role="tabpanel">
            <div className="product-lab__copy reveal">
              <p className="eyebrow">{productViews[productView].name} / {productViews[productView].eyebrow}</p>
              <h3>{productViews[productView].title}</h3>
              <p>{productViews[productView].body}</p>
              <div className="tag-stack">{productViews[productView].tags.map((tag) => <ClaimTag key={tag}>{tag}</ClaimTag>)}</div>
              <a className="text-link" href={`/products/${productViews[productView].name.toLowerCase()}`}>Explore product details <ArrowRight size={15} /></a>
            </div>
            <div className="product-lab__interface" key={productViews[productView].name}><ActiveInterface /></div>
          </div>
        </section>

        <section className="trust section-shell section-shell--dark">
          <SectionIntro dark index="08" eyebrow="Built for operators" title="Control stays visible." body="Cooling optimization belongs inside operational discipline. Recommendations, constraints, approvals, rollback, and evidence remain part of the same sequence." />
          <div className="trust-table reveal">
            {trustRows.map(([index, name, detail]) => (
              <div key={index} className="trust-row">
                <span>{index}</span><strong>{name}</strong><p>{detail}</p><em>{name === "Approval" ? "Operator-owned" : "Documented"}</em>
              </div>
            ))}
          </div>
          <div className="trust-note"><p>Security, deployment model, integrations, and compliance claims publish only after product confirmation.</p><ClaimTag dark>EU product company</ClaimTag></div>
        </section>

        <section className="built-for section-shell">
          <div className="built-for__copy">
            <SectionIntro index="09" eyebrow="Built for dense compute" title="One thermal problem. Different operating realities." body="The same operating model adapts to the teams responsible for capacity, uptime, and infrastructure change." />
            <p className="selector-label">Select an operating reality</p>
          </div>
          <div className="audience-selector reveal">
            <div className="audience-tabs" role="tablist" aria-label="Operating reality">
              {audiences.map((item, index) => <button key={item.label} role="tab" aria-selected={audience === index} onClick={() => setAudience(index)}>{String(index + 1).padStart(2, "0")}<span>{item.label}</span></button>)}
            </div>
            <div className="audience-panel" role="tabpanel">
              <p>{audiences[audience].detail}</p>
              <ul>{audiences[audience].priorities.map((priority) => <li key={priority}><Check size={14} />{priority}</li>)}</ul>
              <a href={solutionLinks[audience].href}>Explore {audiences[audience].label}<ArrowRight size={15} /></a>
            </div>
          </div>
        </section>

        <section className="evidence section-shell">
          <SectionIntro index="10" eyebrow="Evidence before claims" title="Proof will replace promise." body="Validated outcomes enter the site only when Coolerra can show how they were measured and where they apply." />
          <div className="evidence-ledger reveal">
            <div><span>01</span><strong>Baseline</strong><p>Document the operating state, constraints, and measurement window.</p></div>
            <div><span>02</span><strong>Intervention</strong><p>Record the governed recommendation or approved test.</p></div>
            <div><span>03</span><strong>Outcome</strong><p>Publish the observed result with context and limits.</p></div>
          </div>
          <div className="claim-boundary reveal"><ShieldCheck size={20} /><p>Product concept presented without fabricated customers, savings, certifications, or deployment claims.</p><ClaimTag>Claim-safe</ClaimTag></div>
        </section>

        <section id="portfolio-update" className="portfolio-announcement section-shell" aria-labelledby="portfolio-announcement-title">
          <div className="portfolio-announcement__rail reveal">
            <p className="eyebrow">11 / Portfolio announcement</p>
            <div className="portfolio-announcement__amount"><span>TipHub-announced allocation</span><strong>$800K</strong></div>
            <span className="portfolio-announcement__scope">Early stage / Global</span>
          </div>
          <div className="portfolio-announcement__story reveal">
            <h2 id="portfolio-announcement-title">TipHub announces a $800K allocation to Coolerra.</h2>
            <p>Coolerra is joining the TipHub portfolio as it builds thermal intelligence for AI infrastructure and data-centre cooling.</p>
            <div className="portfolio-announcement__actions">
              <a className="portfolio-announcement__primary" href="/news/tiphub-allocation">Read the announcement <ArrowRight size={16} aria-hidden="true" /></a>
              <a className="portfolio-announcement__secondary" href="https://tiphub-prototype-review.vercel.app/companies/coolerra" target="_blank" rel="noreferrer">Visit TipHub <ArrowRight size={14} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="operator-voices section-shell" aria-labelledby="operator-voices-title">
          <div className="operator-voices__heading">
            <p className="eyebrow">12 / Operator perspectives</p>
            <h2 id="operator-voices-title">What thermal intelligence must make possible.</h2>
            <p>Illustrative launch copy for positioning only. Replace with approved customer testimony after validation.</p>
          </div>
          <div className="operator-voices__quotes reveal">
            {testimonials.map((testimonial, index) => (
              <figure key={testimonial.name}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <blockquote>“{testimonial.quote}”</blockquote>
                <figcaption><strong>{testimonial.name}</strong><small>{testimonial.role} · Poland</small></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="conversion section-shell section-shell--dark">
          <div className="conversion-copy reveal">
            <p className="eyebrow">13 / Start with your thermal reality</p>
            <h2>Bring us one room,<br />pod, or cooling loop.</h2>
            <p>Start with a technical discovery session and leave with a scoped data and pilot-readiness plan.</p>
            <div><ButtonLink href="/demo" light>Request a technical conversation</ButtonLink><ButtonLink href="/platform" secondary light>Explore the product</ButtonLink></div>
          </div>
          <img className="conversion-mark" src="/assets/brand/coolerra-mark-color.svg" alt="" aria-hidden="true" />
          <p className="conversion-meta">Poland / European Union · For AI infrastructure operators</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
