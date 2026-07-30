/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { useEffect, useState } from "react";

export const J1_PROJECT_KEY = "ia-rh-j1-project";

const newStep = () => ({ task: "", data: "", people: "", irritant: "", humanControl: "", trace: "" });
const newOpportunity = () => ({ action: "", beneficiary: "", gain: "", limit: "", control: "" });
const newProcess = () => ({ title: "", trigger: "", purpose: "", opportunity: "", opportunityDetails: newOpportunity(), steps: Array.from({ length: 4 }, newStep) });

export function createJ1Project() {
  return {
    version: 2,
    context: { organisation: "", role: "", irritant: "" },
    processes: [newProcess(), newProcess()],
    arbitration: {
      evaluations: {}, retained: "", rationale: "", missingInformation: "", decisionOwner: "", nextStep: "",
    },
    traffic: { axes: {}, decision: "", summary: "" },
    c1: {
      ethicalRisk1: "", ethicalPrevention1: "", ethicalRisk2: "", ethicalPrevention2: "",
      relationalRisk: "", relationalPrevention: "", legalReference1: "", legalReference2: "", questionsToVerify: "",
      indicator: "", baseline: "", baselineMethod: "", target: "", horizon: "", responsible: "",
      included: "", excluded: "", allowedData: "", specialCases: "", humanValidation: "", j2Question: "",
      peerQuestion: "", feedback: "", correction: "", pitchNotes: "",
    },
  };
}

function parse(key) {
  try { return JSON.parse(localStorage.getItem(key) || ""); } catch { return {}; }
}

function normalizeProcess(process = {}) {
  const fallback = newProcess();
  const steps = Array.isArray(process.steps) ? process.steps.slice(0, 7).map((step) => ({ ...newStep(), ...step })) : fallback.steps;
  while (steps.length < 4) steps.push(newStep());
  return { ...fallback, ...process, opportunityDetails: { ...fallback.opportunityDetails, ...(process.opportunityDetails || {}) }, steps };
}

function normalizeProject(project = {}) {
  const fallback = createJ1Project();
  return {
    ...fallback,
    ...project,
    context: { ...fallback.context, ...(project.context || {}) },
    processes: [0, 1].map((index) => normalizeProcess(project.processes?.[index] || fallback.processes[index])),
    arbitration: { ...fallback.arbitration, ...(project.arbitration || {}) },
    traffic: { ...fallback.traffic, ...(project.traffic || {}) },
    c1: { ...fallback.c1, ...(project.c1 || {}) },
  };
}

function migrateLegacyProject() {
  const legacy = parse("ia-rh-cartographer").form || {};
  const traffic = parse("ia-rh-traffic-light").form || {};
  const project = createJ1Project();
  project.context = {
    organisation: legacy.organisation || "",
    role: legacy.role || "",
    irritant: legacy.irritant || "",
  };
  project.processes = [
    normalizeProcess({ title: legacy.processA, opportunity: legacy.opportunityA, steps: [{ task: legacy.taskA, data: legacy.dataA }] }),
    normalizeProcess({ title: legacy.processB, opportunity: legacy.opportunityB, steps: [{ task: legacy.taskB, data: legacy.dataB }] }),
  ];
  project.c1 = {
    ...project.c1,
    ethicalRisk1: legacy.legalRisk || "",
    relationalRisk: legacy.relationalRisk || "",
    ethicalPrevention1: legacy.prevention || "",
    included: legacy.included || "",
    excluded: legacy.excluded || traffic.outOfScope || "",
    humanValidation: legacy.validator || traffic.validator || "",
    indicator: legacy.objective || "",
    baseline: legacy.baseline || "",
    target: legacy.target || "",
    horizon: legacy.horizon || "",
  };
  return project;
}

export function loadJ1Project() {
  const saved = parse(J1_PROJECT_KEY);
  if (saved && Object.keys(saved).length) return normalizeProject(saved);
  return migrateLegacyProject();
}

export function useJ1Project() {
  const [project, setProject] = useState(loadJ1Project);
  useEffect(() => { localStorage.setItem(J1_PROJECT_KEY, JSON.stringify(project)); }, [project]);
  return [project, setProject];
}

export function processName(project, index) {
  return project.processes[index]?.title?.trim() || `Processus RH n°${index + 1}`;
}

export function processOpportunity(project, index) {
  return project.processes[index]?.opportunity?.trim() || "Opportunité à formuler";
}

export function opportunitySentence(details = {}) {
  const action = details.action || "[ACTION PRÉCISE]";
  const gain = details.gain || "[GAIN ATTENDU]";
  const beneficiary = details.beneficiary || "[BÉNÉFICIAIRE]";
  const control = details.control || "[CONTRÔLE HUMAIN]";
  return `Nous envisageons d’utiliser l’IA pour ${action} afin de ${gain}, au bénéfice de ${beneficiary}, tout en conservant ${control}.`;
}
