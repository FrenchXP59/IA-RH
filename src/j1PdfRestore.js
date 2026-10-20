import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import workerSource from "pdfjs-dist/legacy/build/pdf.worker.mjs?url";

GlobalWorkerOptions.workerSrc = workerSource;

const AXES = [
  ["purpose", "Finalité précise"],
  ["minimization", "Minimisation"],
  ["access", "Accès et permissions"],
  ["environment", "Environnement autorisé"],
  ["conservation", "Conservation"],
  ["human", "Validation humaine et hors périmètre"],
];

function clean(value = "") {
  return String(value)
    .replace(/\u00a0/g, " ")
    .replace(/[–—]/g, "—")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

function valueAfter(text, label, stopLabels = []) {
  const expression = new RegExp(`${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*:?\\s*`, "i");
  const found = expression.exec(text);
  if (!found) return "";
  const rest = text.slice(found.index + found[0].length);
  const stops = stopLabels.map((item) => rest.toLowerCase().indexOf(item.toLowerCase())).filter((index) => index >= 0);
  return clean(rest.slice(0, stops.length ? Math.min(...stops) : undefined));
}

function betweenLabels(text, label, stopLabels = []) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(`${escaped}(?:\\s*—\\s*(?:green|orange|red|à compléter))?\\s*`, "i");
  const found = expression.exec(text);
  if (!found) return "";
  const rest = text.slice(found.index + found[0].length);
  const stops = stopLabels.map((item) => rest.toLowerCase().indexOf(item.toLowerCase())).filter((index) => index >= 0);
  return clean(rest.slice(0, stops.length ? Math.min(...stops) : undefined));
}

function splitPair(value) {
  const parts = value.split(/\s*\/\s*/).map(clean);
  return [parts[0] || "", parts.slice(1).join(" / ") || ""];
}

function splitControl(value) {
  const parts = value.split(/\s*·\s*/).map(clean);
  return [parts[0] || "", parts.slice(1).join(" · ") || ""];
}

function readC1(text) {
  const c1Stops = ["Sécurisation", "Objectif et mesure", "Périmètre et passage à J2", "Retour sur le pitch"];
  const organisation = valueAfter(text, "Organisation", ["Irritant", "Processus retenu", "Opportunité", "Arbitrage", ...c1Stops]);
  const irritant = valueAfter(text, "Irritant", ["Processus retenu", "Opportunité", "Arbitrage", ...c1Stops]);
  const processTitle = valueAfter(text, "Processus retenu", ["Opportunité", "Arbitrage", ...c1Stops]);
  const opportunity = valueAfter(text, "Opportunité", ["Arbitrage", ...c1Stops]);
  const rationale = valueAfter(text, "Arbitrage", c1Stops);
  const [risk1, prevention1] = splitPair(valueAfter(text, "Risque 1 / prévention", ["Risque 2 / prévention", "Risque relationnel / préservation", "Références", "À vérifier", "Objectif et mesure"]));
  const [risk2, prevention2] = splitPair(valueAfter(text, "Risque 2 / prévention", ["Risque relationnel / préservation", "Références", "À vérifier", "Objectif et mesure"]));
  const [relationalRisk, relationalPrevention] = splitPair(valueAfter(text, "Risque relationnel / préservation", ["Références", "À vérifier", "Objectif et mesure"]));
  const [target, horizon] = splitPair(valueAfter(text, "Cible / horizon", ["Responsable", "Périmètre et passage à J2"]));
  const patch = {
    context: { organisation, irritant },
    processes: processTitle || opportunity ? [{ title: processTitle, opportunity }, null] : null,
    arbitration: { retained: processTitle || opportunity ? "0" : "", rationale },
    c1: {
      ethicalRisk1: risk1,
      ethicalPrevention1: prevention1,
      ethicalRisk2: risk2,
      ethicalPrevention2: prevention2,
      relationalRisk,
      relationalPrevention,
      legalReference1: valueAfter(text, "Références", ["À vérifier", "Objectif et mesure"]),
      questionsToVerify: valueAfter(text, "À vérifier", ["Objectif et mesure"]),
      indicator: valueAfter(text, "Objectif", ["Baseline", "Méthode/date/source", "Cible / horizon", "Responsable", "Périmètre et passage à J2"]),
      baseline: valueAfter(text, "Baseline", ["Méthode/date/source", "Cible / horizon", "Responsable", "Périmètre et passage à J2"]),
      baselineMethod: valueAfter(text, "Méthode/date/source", ["Cible / horizon", "Responsable", "Périmètre et passage à J2"]),
      target,
      horizon,
      responsible: valueAfter(text, "Responsable", ["Périmètre et passage à J2"]),
      included: valueAfter(text, "Inclus", ["Données autorisées", "Exclus", "Validation humaine", "Question J2", "Retour sur le pitch"]),
      allowedData: valueAfter(text, "Données autorisées", ["Exclus", "Validation humaine", "Question J2", "Retour sur le pitch"]),
      excluded: valueAfter(text, "Exclus", ["Validation humaine", "Question J2", "Retour sur le pitch"]),
      humanValidation: valueAfter(text, "Validation humaine", ["Question J2", "Retour sur le pitch"]),
      j2Question: valueAfter(text, "Question J2", ["Retour sur le pitch"]),
      peerQuestion: valueAfter(text, "Question reçue", ["Évaluation", "Correction"]),
      feedback: valueAfter(text, "Évaluation", ["Correction"]),
      correction: valueAfter(text, "Correction"),
    },
  };
  return { kind: "fiche-c1", label: "Fiche C1", patch, fields: listFields(patch) };
}

function readTrafficLight(text) {
  const axes = {};
  AXES.forEach(([id, label], position) => {
    const remainingLabels = AXES.slice(position + 1).map(([, nextLabel]) => nextLabel).concat(["Formulation C1"]);
    const block = betweenLabels(text, label, remainingLabels);
    if (!block) return;
    const level = new RegExp(`${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*—\\s*(green|orange|red)`, "i").exec(text)?.[1]?.toLowerCase() || "";
    const detail = clean(block.split(/Raison\s*:/i)[0]);
    const reason = valueAfter(block, "Raison", ["Prévention", "Responsable / point de contrôle"]);
    const prevention = valueAfter(block, "Prévention", ["Responsable / point de contrôle"]);
    const [owner, checkpoint] = splitControl(valueAfter(block, "Responsable / point de contrôle"));
    axes[id] = { detail, level, reason, prevention, owner, checkpoint };
  });
  const summary = valueAfter(text, "Formulation C1");
  const patch = { traffic: { axes, summary } };
  return { kind: "feu-tricolore", label: "Feu tricolore des données", patch, fields: listFields(patch) };
}

function listFields(value, prefix = "") {
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => {
    const label = prefix ? `${prefix}.${key}` : key;
    if (typeof item === "string") return item ? [label] : [];
    if (item && typeof item === "object") return listFields(item, label);
    return [];
  });
}

function groupTextIntoLines(items) {
  const lines = new Map();
  items.filter((item) => item.str?.trim()).forEach((item) => {
    const y = Math.round((item.transform?.[5] || 0) / 2) * 2;
    const line = lines.get(y) || [];
    line.push({ x: item.transform?.[4] || 0, text: item.str });
    lines.set(y, line);
  });
  return [...lines.entries()]
    .sort(([firstY], [secondY]) => secondY - firstY)
    .map(([, line]) => line.sort((first, second) => first.x - second.x).map((item) => item.text).join(" "))
    .join("\n");
}

export async function extractTextFromPdf(file) {
  if (!file || file.type !== "application/pdf") throw new Error("Choisissez un export PDF.");
  if (file.size > 12 * 1024 * 1024) throw new Error("Ce fichier est trop volumineux pour une lecture locale. Choisissez l’export de l’application.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument({ data: bytes }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(groupTextIntoLines(content.items));
  }
  return clean(pages.join("\n"));
}

export function restoreJ1Export(text) {
  const cleaned = clean(text);
  if (/Feu tricolore des données/i.test(cleaned)) return readTrafficLight(cleaned);
  if (/Fiche C1/i.test(cleaned)) return readC1(cleaned);
  throw new Error("Export non reconnu. Importez un PDF généré par le Feu tricolore ou le Studio C1.");
}

export function applyJ1Restore(project, patch) {
  const importedProcesses = patch.processes || [];
  return {
    ...project,
    context: { ...project.context, ...(patch.context || {}) },
    processes: project.processes.map((process, index) => importedProcesses[index]
      ? { ...process, ...importedProcesses[index] }
      : process),
    arbitration: { ...project.arbitration, ...(patch.arbitration || {}) },
    traffic: {
      ...project.traffic,
      ...(patch.traffic || {}),
      axes: { ...project.traffic.axes, ...(patch.traffic?.axes || {}) },
    },
    c1: { ...project.c1, ...(patch.c1 || {}) },
  };
}
