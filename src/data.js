export const productLinks = [
  { label: "Platform", href: "/platform", detail: "One thermal operating model" },
  { label: "Monitor", href: "/products/monitor", detail: "See the current thermal state" },
  { label: "Optimize", href: "/products/optimize", detail: "Turn imbalance into governed action" },
  { label: "Predict", href: "/products/predict", detail: "Prepare for the next workload state" },
];

export const solutionLinks = [
  { label: "AI Data Centers", href: "/solutions/ai-data-centers", detail: "High-density GPU halls and pods" },
  { label: "GPU Cloud", href: "/solutions/gpu-cloud", detail: "Workload-aware facility planning" },
  { label: "Colocation", href: "/solutions/colocation", detail: "Mixed halls, tenants, and cooling modes" },
  { label: "Enterprise GPU Rooms", href: "/solutions/enterprise-server-rooms", detail: "Constrained rooms and retrofit estates" },
];

export const productData = {
  monitor: {
    eyebrow: "Coolerra Monitor",
    title: "See the operating state, not just the alarms.",
    description: "Align thermal, cooling, power, and workload signals in one current-state view built for dense compute.",
    outcomes: ["Thermal topology", "Sensor confidence", "Event history", "Data-quality state"],
    question: "Can the team trust the current thermal picture?",
    answer: "Monitor keeps facility context, signal quality, and local deviations together so an operator can distinguish noise from a condition that needs review.",
  },
  optimize: {
    eyebrow: "Coolerra Optimize",
    title: "Make every proposed change governable.",
    description: "Move from measured imbalance to a reviewable action with constraints, expected effect, approval, and rollback context.",
    outcomes: ["Visible guardrails", "Expected effect", "Operator approval", "Audit trail"],
    question: "How is a cooling action proposed and controlled?",
    answer: "Optimize presents the reason, constraint envelope, confidence, approval state, and reversal path before an operating action moves forward.",
  },
  predict: {
    eyebrow: "Coolerra Predict",
    title: "See the next thermal state before it arrives.",
    description: "Forecast hotspot probability and cooling demand against the next workload and environmental scenario.",
    outcomes: ["Forecast horizon", "Uncertainty band", "Scenario comparison", "Preparation window"],
    question: "What changes when the next workload lands?",
    answer: "Predict keeps the current state, likely future state, and uncertainty visible so teams can prepare without presenting forecasts as deterministic.",
  },
};

export const solutionData = {
  "ai-data-centers": {
    eyebrow: "AI Data Centers",
    title: "Thermal intelligence for rapidly changing GPU density.",
    description: "Coordinate facility response with concentrated compute loads across air, liquid, and hybrid environments.",
    priorities: ["GPU pod density", "Air and liquid domains", "Capacity headroom", "Operator response"],
  },
  "gpu-cloud": {
    eyebrow: "GPU Cloud Providers",
    title: "Prepare the facility for the workload schedule.",
    description: "Connect upcoming workload concentration with the thermal conditions that support reliable utilization.",
    priorities: ["Scheduled load ramps", "Facility readiness", "Scenario planning", "Thermal risk"],
  },
  colocation: {
    eyebrow: "Colocation Operators",
    title: "A consistent thermal view across mixed operating realities.",
    description: "Bring room, hall, and tenant context into one legible operating model without erasing local constraints.",
    priorities: ["Mixed tenants", "Diverse cooling modes", "Hall comparison", "Operational consistency"],
  },
  "enterprise-server-rooms": {
    eyebrow: "Enterprise GPU Rooms",
    title: "Make constrained infrastructure easier to operate.",
    description: "Build a clearer thermal picture for retrofit rooms, limited instrumentation, and small infrastructure teams.",
    priorities: ["Retrofit constraints", "Limited telemetry", "Local operations", "Pilot readiness"],
  },
};

export const resourceItems = [
  { type: "Method", title: "A practical thermal baseline for dense compute", detail: "How Coolerra proposes to separate room averages from local operating state." },
  { type: "Engineering note", title: "Why workload context belongs beside cooling telemetry", detail: "A framework for aligning facility response with changing compute density." },
  { type: "Research brief", title: "EU data-center reporting and the measurement discipline ahead", detail: "A category overview grounded in European Commission guidance." },
];
