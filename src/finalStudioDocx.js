import {
  AlignmentType,
  Document,
  Footer,
  Header,
  PageNumber,
  Packer,
  Paragraph,
  TextRun,
} from "docx";

const BLUE = "2E74B5";
const DARK = "183143";
const MUTED = "5E7184";
const EMPTY = "À compléter";

const TEST_LABELS = {
  normal: "Normal",
  limit: "Limite",
  forbidden: "Interdit",
  accessibility: "Accessibilité",
  bias: "Biais & équité",
};

function valueOf(value, fallback = EMPTY) {
  const text = String(value || "").trim();
  return text || fallback;
}

function joined(values, separator = " · ") {
  return values.filter((value) => String(value || "").trim()).join(separator);
}

function field(label, value, fallback = EMPTY) {
  return new Paragraph({
    style: "Field",
    children: [
      new TextRun({ text: `${label} : `, bold: true, color: DARK }),
      new TextRun({ text: valueOf(value, fallback), color: DARK }),
    ],
  });
}

function sectionTitle(text) {
  return new Paragraph({ style: "SectionTitle", text });
}

function subTitle(text) {
  return new Paragraph({ style: "SubsectionTitle", text });
}

function metric(label, before, after) {
  return field(label, `Avant / baseline : ${valueOf(before, "À collecter")} · Après / observation : ${valueOf(after, "À observer")}`);
}

function numberValue(value) {
  const normalized = String(value || "").trim().replace(",", ".");
  return /^\d+(\.\d+)?$/.test(normalized) ? Number(normalized) : null;
}

function roiValue(form) {
  const volume = numberValue(form.roiVolume);
  const before = numberValue(form.roiMinutesBefore);
  const target = numberValue(form.roiMinutesTarget);
  const hourlyCost = numberValue(form.roiHourlyCost);
  if (volume === null || before === null || target === null || before <= target) {
    return "À estimer pendant le pilote : aucune valeur constatée n’est déclarée à ce stade.";
  }
  const hours = ((before - target) * volume) / 60;
  const grossValue = hourlyCost !== null
    ? ` · valeur brute estimée : ${Math.round(hours * hourlyCost).toLocaleString("fr-FR")} €`
    : "";
  return `Gain de capacité estimé : ${Math.round(hours)} h par période${grossValue}. Estimation à confirmer pendant le pilote ; ce n’est pas un ROI net constaté.`;
}

function solutionBlock(label, solution = {}) {
  return [
    subTitle(`${label} — ${valueOf(solution.name)}`),
    field("Source / date", joined([solution.source, solution.date])),
    field("Éléments confirmés", solution.confirmed),
    field("Informations à confirmer", solution.toConfirm),
  ];
}

function testBlock([key, test = {}]) {
  return [
    subTitle(`Test ${TEST_LABELS[key] || key}`),
    field("Attendu", test.expected),
    field("Observé", test.observed),
    field("Ajustement", test.adjustment),
  ];
}

/** Builds the editable C1–C5 Word document. No learner data leaves the browser. */
export function createFinalStudioDocx({ snapshot, form }) {
  const c1 = snapshot.c1 || {};
  const c2 = snapshot.c2 || {};
  const c3 = snapshot.c3 || {};
  const risks = c1.risks || [];
  const tests = Object.entries(c3.tests || {});

  const children = [
    new Paragraph({ style: "Kicker", text: "FORMATION IA & RH · DOSSIER FINAL" }),
    new Paragraph({ style: "DocumentTitle", text: "Projet professionnel — synthèse C1 à C5" }),
    new Paragraph({ style: "Lead", text: "Document modifiable généré depuis le Studio Certification final. Les contenus restent à relire, compléter et valider par le participant." }),
    field("Organisation / contexte", c1.organisation),
    field("Processus RH retenu", c1.retainedProcess),

    sectionTitle("C1 — Cadrer le projet"),
    field("Problème observé", c1.problem),
    ...((c1.processes || []).flatMap((process, index) => field(`Opportunité ${index + 1} — ${valueOf(process.name)}`, process.opportunity))),
    field("Arbitrage", c1.arbitration),
    field("Objectif", c1.objective),
    field("Baseline et cible", joined([c1.baseline, c1.target, c1.horizon], " → ")),
    field("Méthode de collecte de la baseline", c1.baselineMethod),
    field("Périmètre", c1.perimeter),
    field("Hors périmètre", c1.outOfScope),
    field("Données autorisées", c1.allowedData),
    field("Décision restant humaine", c1.humanDecision),
    ...risks.flatMap(([risk, prevention], index) => (risk || prevention
      ? field(`Risque ${index + 1} / prévention`, joined([risk, prevention], " — "))
      : [])),
    field("Références mobilisées", joined(c1.legalReferences || [])),

    sectionTitle("C2 — Comparer et choisir"),
    ...solutionBlock("Solution A", c2.solutionA),
    ...solutionBlock("Solution B", c2.solutionB),
    field("Choix conditionnel", c2.conditionalChoice),
    field("Responsable de vérification", c2.verificationOwner),

    sectionTitle("C3 — Concevoir et tester"),
    field("Prompt V1", c3.promptV1),
    field("Critique de la V1", c3.critiqueV1),
    field("Évolutions V1 → V2", c3.versionChanges),
    field("Prompt V2", c3.promptV2),
    field("Prompt de contrôle", c3.controlPrompt),
    field("Exigence d’accessibilité", c3.accessibilityRequirement),
    field("Données autorisées", c3.authorizedData),
    field("Données exclues", c3.forbiddenData),
    ...tests.flatMap(testBlock),
    field("Décision issue des tests", c3.j2Decision),
    field("Justification", c3.j2Justification),
    field("Limite identifiée", c3.identifiedLimit),

    sectionTitle("C4 — Mesurer les effets"),
    metric("Efficacité", form.efficiencyBefore, form.efficiencyAfter),
    metric("Qualité", form.qualityBefore, form.qualityAfter),
    metric("Relation humaine", form.humanBefore, form.humanAfter),
    field("Organisation de la collecte", form.collectionPlan),
    field("Retour des personnes concernées", form.userFeedback),
    field("Volume retenu pour l’estimation", form.roiVolume ? `${form.roiVolume} unités par période` : "À compléter"),
    field("Estimation de valeur / ROI", roiValue(form)),
    field("Coûts ou conditions à confirmer", form.roiCostNotes),

    sectionTitle("C5 — Accompagner l’adoption"),
    field("Personnes concernées", form.audiences),
    field("Message essentiel", form.keyMessage),
    field("Information et supports", form.diffusionActions),
    field("Prise en main et assistance", form.trainingAndSupport),
    field("Règles d’usage et sobriété", form.charterAndSobriety),

    sectionTitle("Décision finale"),
    field("Décision", form.decision),
    field("Justification", form.decisionRationale),
    field("Prochaine action", form.nextAction),
    field("Date de revue", form.reviewDate),
    field("Règle d’arrêt", form.stopRule),
    field("Responsable humain", c3.humanOwner),
    new Paragraph({
      style: "ClosingNote",
      text: "Ce document structure les éléments renseignés dans l’espace apprenant. Il ne remplace ni la vérification des sources, ni la validation humaine, ni une analyse juridique ou conformité.",
    }),
  ];

  return new Document({
    creator: "IA & RH — Espace apprenant",
    title: "Dossier final IA & RH — C1 à C5",
    description: "Export modifiable du Studio Certification final",
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22, color: DARK },
          paragraph: { spacing: { after: 120, line: 264 } },
        },
      },
      paragraphStyles: [
        { id: "Kicker", name: "Kicker", run: { font: "Calibri", size: 18, bold: true, color: BLUE, characterSpacing: 40 }, paragraph: { spacing: { after: 120 } } },
        { id: "DocumentTitle", name: "Document title", run: { font: "Calibri", size: 36, bold: true, color: DARK }, paragraph: { spacing: { after: 120 } } },
        { id: "Lead", name: "Lead", run: { font: "Calibri", size: 22, color: MUTED, italics: true }, paragraph: { spacing: { after: 240, line: 300 } } },
        { id: "SectionTitle", name: "Section title", run: { font: "Calibri", size: 30, bold: true, color: BLUE }, paragraph: { spacing: { before: 300, after: 140 } } },
        { id: "SubsectionTitle", name: "Subsection title", run: { font: "Calibri", size: 24, bold: true, color: DARK }, paragraph: { spacing: { before: 180, after: 80 } } },
        { id: "Field", name: "Field", run: { font: "Calibri", size: 22, color: DARK }, paragraph: { spacing: { after: 100, line: 264 } } },
        { id: "ClosingNote", name: "Closing note", run: { font: "Calibri", size: 20, color: MUTED, italics: true }, paragraph: { spacing: { before: 280 } } },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440, header: 720, footer: 720 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "IA & RH — Dossier final", size: 18, color: MUTED })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Document de travail modifiable · Page ", size: 18, color: MUTED }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MUTED }),
            ],
          })],
        }),
      },
      children,
    }],
  });
}

export async function downloadFinalStudioDocx(data) {
  const blob = await Packer.toBlob(createFinalStudioDocx(data));
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dossier-ia-rh-c1-a-c5-modifiable.docx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}
