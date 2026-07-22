import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Check, ChevronRight, Clock3, ShieldCheck } from "lucide-react";

const rackTemperatures = [
  21.6, 22.1, 22.5, 23.2, 22.8, 21.9,
  22.0, 22.7, 23.4, 24.2, 23.1, 22.4,
  21.7, 22.2, 22.9, 23.6, 24.7, 23.2,
  21.5, 21.9, 22.6, 23.0, 23.8, 22.7,
];

const forecast = Array.from({ length: 24 }, (_, index) => ({
  time: index,
  inlet: Number((21.6 + Math.sin(index / 4) * 0.65 + Math.max(index - 12, 0) * 0.19).toFixed(2)),
  low: Number((20.9 + Math.sin(index / 4) * 0.45 + Math.max(index - 12, 0) * 0.12).toFixed(2)),
  high: Number((22.2 + Math.sin(index / 4) * 0.75 + Math.max(index - 12, 0) * 0.26).toFixed(2)),
}));

const optimizeEffect = [
  { step: "Now", current: 24.2, proposed: 24.2 },
  { step: "+5", current: 24.4, proposed: 23.8 },
  { step: "+10", current: 24.5, proposed: 23.4 },
  { step: "+15", current: 24.4, proposed: 23.1 },
  { step: "+20", current: 24.6, proposed: 22.9 },
  { step: "+30", current: 24.7, proposed: 22.8 },
];

function TemperatureTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip">{payload[0].value}°C</div>;
}

function UIMetric({ label, value, tone = "cryo" }) {
  return (
    <div className="ui-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <i data-tone={tone} />
    </div>
  );
}

export function MonitorInterface({ compact = false }) {
  const [selectedRack, setSelectedRack] = useState(16);
  const selectedTemperature = rackTemperatures[selectedRack];
  return (
    <div className={`product-ui product-ui--monitor ${compact ? "product-ui--compact" : ""}`}>
      <aside className="product-ui__sidebar">
        <img src="/assets/brand/coolerra-logo-horizontal-reversed.svg" alt="Coolerra" />
        <nav aria-label="Monitor interface">
          <span>Overview</span>
          <span className="active">Thermal map</span>
          <span>Equipment</span>
          <span>Events</span>
          <span>Reports</span>
        </nav>
        <div><small>Warsaw Lab 04</small><strong>Nominal</strong></div>
      </aside>
      <div className="product-ui__main">
        <div className="ui-titlebar">
          <div><h3>Facility overview</h3><p>GPU Hall A / thermal topology</p></div>
          <span className="live-state">Live <i /> 12 min</span>
        </div>
        <div className="rack-map">
          <div className="rack-map__heading">
            <span>Aisle thermal field</span>
            <span>Selected R{String(selectedRack + 1).padStart(2, "0")} · {selectedTemperature.toFixed(1)}°C</span>
          </div>
          <div className="rack-grid">
            {rackTemperatures.map((value, index) => {
              const tone = value > 24 ? "hot" : value > 23 ? "warm" : value > 22 ? "balanced" : "cool";
              return (
                <button
                  type="button"
                  className={selectedRack === index ? "selected" : ""}
                  data-tone={tone}
                  key={index}
                  onClick={() => setSelectedRack(index)}
                  aria-label={`Rack ${index + 1}, ${value.toFixed(1)} degrees Celsius`}
                >
                  <i />
                  <span>R{String(index + 1).padStart(2, "0")}</span>
                  <strong>{value.toFixed(1)}°</strong>
                </button>
              );
            })}
          </div>
          <div className="rack-legend"><span>21°C</span><i /><i /><i /><span>25°C</span></div>
        </div>
        <div className="ui-metrics">
          <UIMetric label="Room average" value="22.4°C" />
          <UIMetric label="Active anomalies" value="2" tone="heat" />
          <UIMetric label="Data confidence" value="96.8%" tone="green" />
          <UIMetric label="IT load" value="3.6 MW" tone="green" />
        </div>
        <div className="event-strip">
          <div><strong>14:32 / Rack R17 inlet deviation</strong><span>+1.8°C above modeled state · sensor confidence 94%</span></div>
          <button type="button" onClick={() => setSelectedRack(16)}>Review event <ChevronRight size={14} /></button>
        </div>
        <p className="ui-disclaimer">Demo environment / values are illustrative</p>
      </div>
    </div>
  );
}

export function OptimizeInterface({ compact = false }) {
  const [approved, setApproved] = useState(false);
  return (
    <div className={`product-ui product-ui--optimize ${compact ? "product-ui--compact" : ""}`}>
      <div className="optimize-bar"><strong>Coolerra Optimize</strong><span>{approved ? "Approved" : "Review mode"}</span></div>
      <div className="optimize-body">
        <div className="ui-titlebar"><div><h3>Action review</h3><p>Cooling loop L-04 / GPU Hall A</p></div></div>
        <div className="proposal-row">
          <div><small>Proposed setpoint change</small><strong>+0.6°C</strong><p>Raise chilled-water supply setpoint after workload redistribution.</p></div>
          <UIMetric label="Current" value="23.8°C" />
          <UIMetric label="Expected" value="22.9°C" tone="green" />
          <UIMetric label="Confidence" value="89%" tone="green" />
        </div>
        <div className="optimize-grid">
          <div className="guardrail-panel">
            <small>Safety envelope</small>
            {["Inlet threshold < 25.0°C", "Pressure range maintained", "Rollback state captured", "Operator approval required"].map((item, index) => (
              <div key={item} className={index === 3 && !approved ? "pending" : ""}>
                {index === 3 && !approved ? <Clock3 size={14} /> : <Check size={14} />}
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="effect-chart">
            <small>Expected thermal effect / 30 min</small>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={optimizeEffect} barGap={0}>
                <XAxis dataKey="step" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#8ca19b" }} />
                <YAxis domain={[20, 26]} hide />
                <Tooltip content={<TemperatureTooltip />} />
                <Bar dataKey="current" fill="#ff5b45" radius={[2, 2, 0, 0]} />
                <Bar dataKey="proposed" fill="#b7ff69" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="approval-rail">
          <div><span>Prepared by Coolerra / constraints passed / rollback available</span><strong>{approved ? "Operator approval recorded" : "Awaiting operator"}</strong></div>
          <button type="button" onClick={() => setApproved((value) => !value)}>{approved ? "Reopen review" : "Approve action"}</button>
        </div>
      </div>
    </div>
  );
}

export function PredictInterface({ compact = false }) {
  const [scenario, setScenario] = useState("Distributed workload");
  const risk = scenario === "Distributed workload" ? "18%" : scenario === "Concentrated workload" ? "31%" : "11%";
  return (
    <div className={`product-ui product-ui--predict ${compact ? "product-ui--compact" : ""}`}>
      <div className="ui-titlebar">
        <div><h3>Scenario forecast</h3><p>Next workload window / 18:00–20:00</p></div>
        <span className="model-state"><ShieldCheck size={14} /> Model ready</span>
      </div>
      <div className="forecast-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast} margin={{ top: 18, right: 10, bottom: 0, left: -24 }}>
            <CartesianGrid vertical={false} stroke="#e4eae7" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tickFormatter={(value) => value === 0 ? "Now" : value === 23 ? "+120 min" : ""} tick={{ fontSize: 10, fill: "#6b7d77" }} />
            <YAxis domain={[20, 27]} tick={{ fontSize: 10, fill: "#6b7d77" }} axisLine={false} tickLine={false} />
            <Tooltip content={<TemperatureTooltip />} />
            <ReferenceLine y={25} stroke="#ff5b45" strokeDasharray="4 4" label={{ value: "25°C threshold", fill: "#ff5b45", fontSize: 10 }} />
            <Area type="monotone" dataKey="high" stackId="band" stroke="none" fill="#f6d8d2" fillOpacity={0.55} />
            <Area type="monotone" dataKey="low" stackId="band" stroke="none" fill="#fff" />
            <Area type="monotone" dataKey="inlet" stroke="#073b32" strokeWidth={2} fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="ui-metrics">
        <UIMetric label="Hotspot probability" value={risk} tone="heat" />
        <UIMetric label="Peak inlet" value={scenario === "Concentrated workload" ? "25.2°C" : "24.1°C"} />
        <UIMetric label="Prep window" value="18 min" tone="green" />
        <UIMetric label="Confidence" value="84%" tone="green" />
      </div>
      <div className="scenario-row">
        <div><small>Scenario</small><strong>{scenario}</strong><span>{scenario === "Distributed workload" ? "12% lower modeled peak inlet risk" : "Compare workload placement against the current facility state"}</span></div>
        <select value={scenario} onChange={(event) => setScenario(event.target.value)} aria-label="Forecast scenario">
          <option>Distributed workload</option>
          <option>Concentrated workload</option>
          <option>Staged workload</option>
        </select>
      </div>
      <p className="ui-disclaimer">Illustrative forecast</p>
    </div>
  );
}
