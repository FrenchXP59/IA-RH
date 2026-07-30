/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, CheckCircle2, ClipboardCheck,
  Download, FileCheck2, Gauge, Info, MessageSquareText, RefreshCw, Save,
  ShieldCheck, Sparkles, Target, UsersRound,
} from "lucide-react";
import { loadJ1Project, processName, processOpportunity } from "./j1Project";
import "./FinalCertificationStudio.css";

const STORAGE_KEY = "ia-rh-final-certification-studio";
const J2_STORAGE_KEY = "ia-rh-j2-certification-studio";

const STEPS = [
  ["Reprendre J1 & J2", RefreshCw],
  ["Faire adopter", UsersRound],
  ["Mesurer", Gauge],
  ["Décider & exporter", FileCheck2],
];

const TEST_LABELS = {
  normal: "Normal",
  limit: "Limite",
  forbidden: "Interdit",
  accessibility: "Accessibilité",
  bias: "Biais & équité",
};

const defaultJ3 = {
  audiences: "",
  keyMessage: "",
  diffusionActions: "",
  trainingAndSupport: "",
  charterAndSobriety: "",
  efficiencyBefore: "",
  efficiencyAfter: "",
  qualityBefore: "",
  qualityAfter: "",
  humanBefore: "",
  humanAfter: "",
  collectionPlan: "",
  userFeedback: "",
  decision: "",
  decisionRationale: "",
  nextAction: "",
  reviewDate: "",
  stopRule: "",
};

function parseStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function buildSnapshot() {
  const j1 = loadJ1Project();
  const j2 = parseStorage(J2_STORAGE_KEY);
  const retained = ["0", "1"].includes(j1.arbitration?.retained)
    ? Number(j1.arbitration.retained)
    : null;

  return {
    capturedAt: new Date().toISOString(),
    c1: {
      organisation: j2.context || j1.context.organisation || "",
      role: j1.context.role || "",
      problem: j2.problem || j1.context.irritant || "",
      processes: [0, 1].map((index) => ({
        name: processName(j1, index),
        opportunity: processOpportunity(j1, index),
      })),
      retainedProcess: j2.process || (retained !== null ? processName(j1, retained) : ""),
      retainedOpportunity: retained !== null ? processOpportunity(j1, retained) : "",
      arbitration: j1.arbitration.rationale || "",
      risks: [
        [j1.c1.ethicalRisk1, j1.c1.ethicalPrevention1],
        [j1.c1.ethicalRisk2, j1.c1.ethicalPrevention2],
        [j1.c1.relationalRisk, j1.c1.relationalPrevention],
      ],
      legalReferences: [j1.c1.legalReference1, j1.c1.legalReference2].filter(Boolean),
      objective: j2.objective || j1.c1.indicator || "",
      baseline: j2.baseline || j1.c1.baseline || "",
      baselineMethod: j1.c1.baselineMethod || "",
      target: j1.c1.target || "",
      horizon: j1.c1.horizon || "",
      perimeter: j2.perimeter || j1.c1.included || "",
      outOfScope: j2.outOfScope || j1.c1.excluded || "",
      allowedData: j2.authorizedData || j1.c1.allowedData || "",
      humanDecision: j2.humanDecision || j1.c1.humanValidation || "",
    },
    c2: {
      solutionA: { ...(j2.solutionA || {}) },
      solutionB: { ...(j2.solutionB || {}) },
      conditionalChoice: j2.conditionalChoice || "",
      verificationOwner: j2.verificationOwner || "",
    },
    c3: {
      promptV1: j2.promptV1 || "",
      critiqueV1: j2.critiqueV1 || "",
      promptV2: j2.promptV2 || "",
      controlPrompt: j2.controlPrompt || "",
      accessibilityRequirement: j2.accessibilityRequirement || "",
      versionChanges: j2.versionChanges || "",
      authorizedData: j2.authorizedData || "",
      forbiddenData: j2.forbiddenData || "",
      tests: { ...(j2.tests || {}) },
      j2Decision: j2.decision || "",
      j2Justification: j2.justification || "",
      identifiedLimit: j2.identifiedLimit || "",
      humanOwner: j2.humanOwner || j1.c1.responsible || "",
      nextAction: j2.nextAction || "",
      reviewDate: j2.reviewDate || "",
      restartCondition: j2.restartCondition || "",
    },
  };
}

function loadStudio() {
  const saved = parseStorage(STORAGE_KEY);
  const snapshot = saved.snapshot?.c1 ? saved.snapshot : buildSnapshot();
  const j3 = { ...defaultJ3, ...(saved.j3 || {}) };

  if (!j3.efficiencyBefore) j3.efficiencyBefore = snapshot.c1.baseline || "";
  if (!j3.nextAction) j3.nextAction = snapshot.c3.nextAction || "";
  if (!j3.reviewDate) j3.reviewDate = snapshot.c3.reviewDate || "";

  return { snapshot, j3 };
}

export function FinalCertificationStudio({ back }) {
  const [step, setStep] = useState(0);
  const [studio, setStudio] = useState(loadStudio);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(studio));
  }, [studio]);

  const update = (field, value) => setStudio((current) => ({
    ...current,
    j3: { ...current.j3, [field]: value },
  }));

  const refreshSnapshot = () => setStudio((current) => {
    const snapshot = buildSnapshot();
    return {
      snapshot,
      j3: {
        ...current.j3,
        efficiencyBefore: current.j3.efficiencyBefore || snapshot.c1.baseline || "",
        nextAction: current.j3.nextAction || snapshot.c3.nextAction || "",
        reviewDate: current.j3.reviewDate || snapshot.c3.reviewDate || "",
      },
    };
  });

  const counts = useMemo(() => getCounts(studio), [studio]);
  const completion = Math.round((counts.j3 / counts.totalJ3) * 100);
  const projectName = studio.snapshot.c1.retainedProcess || "Votre projet IA & RH";

  const exportDocument = () => {
    setExported(true);
    window.setTimeout(() => window.print(), 80);
  };

  return <main className="fs-shell">
    <header className="fs-topbar">
      <button className="fs-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 3</button>
      <div className="fs-brand"><span><FileCheck2 size={17} /></span> Studio Certification final</div>
      <div className="fs-save"><Save size={15} /> Sauvegarde locale</div>
    </header>

    <section className="fs-hero">
      <div className="fs-hero-image" role="img" aria-label="Professionnels préparant le déploiement responsable d’un projet IA et RH" />
      <div className="fs-hero-content">
        <p className="fs-eyebrow">JOUR 3 · SYNTHÈSE C1 À C5</p>
        <h1>Compléter l’essentiel.<br /><span>Ne rien recommencer.</span></h1>
        <p>Le Studio reprend le cadrage du J1 et les productions du J2. Vous ajoutez seulement l’adoption, la mesure et votre décision finale.</p>
        <div className="fs-pills">
          <span><RefreshCw size={15} /> Reprise J1 & J2</span>
          <span><BadgeCheck size={15} /> 3 compléments J3</span>
          <span><ShieldCheck size={15} /> Décision humaine</span>
        </div>
      </div>
    </section>

    <section className="fs-layout">
      <aside className="fs-stepper">
        <p>VOTRE SYNTHÈSE</p>
        {STEPS.map(([label, Icon], index) => <button
          type="button"
          className={index === step ? "active" : index < step ? "done" : ""}
          onClick={() => setStep(index)}
          key={label}
        >
          <span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span>
          <b>{String(index + 1).padStart(2, "0")}</b>
          {label}
        </button>)}
        <div className="fs-progress-card">
          <div><span style={{ width: `${completion}%` }} /></div>
          <b>{completion}% des repères J3</b>
          <small>{counts.j3} / {counts.totalJ3} éléments renseignés</small>
        </div>
      </aside>

      <section className="fs-workspace">
        <div className="fs-step-heading">
          <span>ÉTAPE {step + 1} / 4</span>
          <div><h2>{STEPS[step][0]}</h2><p>{descriptions[step]}</p></div>
        </div>

        {step === 0 && <ImportedWork snapshot={studio.snapshot} counts={counts} refresh={refreshSnapshot} />}
        {step === 1 && <Adoption form={studio.j3} update={update} />}
        {step === 2 && <Measurement form={studio.j3} update={update} />}
        {step === 3 && <FinalDecision form={studio.j3} update={update} snapshot={studio.snapshot} exportDocument={exportDocument} />}

        <div className="fs-actions">
          <button className="fs-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Précédent</button>
          {step < 3
            ? <button className="fs-primary" onClick={() => setStep((current) => current + 1)}>Continuer <ArrowRight size={17} /></button>
            : <button className="fs-primary" onClick={exportDocument}><Download size={17} /> Exporter le dossier final</button>}
        </div>
        {exported && step === 3 && <p className="fs-exported"><CheckCircle2 size={17} /> Dans la fenêtre d’impression, choisissez « Enregistrer au format PDF ».</p>}
      </section>

      <aside className="fs-live">
        <div className="fs-live-image" />
        <div className="fs-live-body">
          <div className="fs-live-label"><span /> DOSSIER FINAL</div>
          <h3>{projectName}</h3>
          <p>{studio.snapshot.c1.objective || "L’objectif défini au J1/J2 apparaîtra ici."}</p>
          <div className="fs-live-row"><b>J1 retrouvé</b><span>{counts.j1} repères</span></div>
          <div className="fs-live-row"><b>J2 retrouvé</b><span>{counts.j2} repères</span></div>
          <div className={`fs-live-decision ${studio.j3.decision.toLowerCase()}`}>
            <span>Décision finale</span>
            <b>{studio.j3.decision || "À décider"}</b>
          </div>
          <div className="fs-human"><ShieldCheck size={16} /><span>Responsable humain<br /><b>{studio.snapshot.c3.humanOwner || "À retrouver ou préciser"}</b></span></div>
        </div>
      </aside>
    </section>

    <PrintDocument snapshot={studio.snapshot} form={studio.j3} />
  </main>;
}

const descriptions = [
  "Vérifiez simplement que le bon projet a été retrouvé. Les réponses des deux premières journées ne sont pas à saisir une seconde fois.",
  "Précisez comment les personnes seront informées, accompagnées et pourront demander de l’aide. Une formulation courte suffit.",
  "Préparez une comparaison simple sur trois dimensions : efficacité, qualité et relation humaine. Une donnée non disponible reste « à collecter ».",
  "Vous choisissez la conclusion. Le Studio rassemble C1 à C5 sans décider à votre place et sans inventer les informations manquantes.",
];

function ImportedWork({ snapshot, counts, refresh }) {
  const tests = Object.values(snapshot.c3.tests || {}).filter((test) => test?.observed).length;
  return <div className="fs-imported">
    <div className="fs-note">
      <Info size={20} />
      <div><b>Même ordinateur et même navigateur ?</b><p>Les données sont reprises automatiquement. Sinon, elles restent simplement à compléter dans les Studios d’origine.</p></div>
    </div>
    <div className="fs-source-grid">
      <article>
        <header><span className="j1">J1</span><div><b>Studio C1</b><small>{counts.j1} informations retrouvées</small></div><CheckCircle2 size={20} /></header>
        <dl>
          <div><dt>Processus</dt><dd>{snapshot.c1.retainedProcess || "À choisir dans le Studio C1"}</dd></div>
          <div><dt>Objectif</dt><dd>{snapshot.c1.objective || "À compléter dans le Studio C1"}</dd></div>
          <div><dt>Baseline</dt><dd>{snapshot.c1.baseline || "À collecter"}</dd></div>
          <div><dt>Périmètre</dt><dd>{snapshot.c1.perimeter || "À compléter dans le Studio C1"}</dd></div>
        </dl>
      </article>
      <article>
        <header><span className="j2">J2</span><div><b>Studio Certification J2</b><small>{counts.j2} informations retrouvées</small></div><CheckCircle2 size={20} /></header>
        <dl>
          <div><dt>Solutions</dt><dd>{[snapshot.c2.solutionA?.name, snapshot.c2.solutionB?.name].filter(Boolean).join(" · ") || "À compléter dans le Studio J2"}</dd></div>
          <div><dt>Choix</dt><dd>{snapshot.c2.conditionalChoice || "À compléter dans le Studio J2"}</dd></div>
          <div><dt>Prompts</dt><dd>{[snapshot.c3.promptV1, snapshot.c3.promptV2, snapshot.c3.controlPrompt].filter(Boolean).length} version(s) retrouvée(s)</dd></div>
          <div><dt>Tests</dt><dd>{tests} / 5 résultats renseignés</dd></div>
        </dl>
      </article>
    </div>
    <button type="button" className="fs-refresh" onClick={refresh}><RefreshCw size={16} /> Reprendre les données les plus récentes</button>
    <p className="fs-calm"><Sparkles size={16} /> Vous ne devez pas recopier les risques, les sources, les prompts ou les tests déjà enregistrés.</p>
  </div>;
}

function Field({ label, hint, value, onChange, placeholder, area = true, type = "text" }) {
  const Input = area ? "textarea" : "input";
  return <label className="fs-field">
    <span>{label}{hint && <small>{hint}</small>}</span>
    <Input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
  </label>;
}

function Adoption({ form, update }) {
  return <div className="fs-stack">
    <div className="fs-callout">
      <MessageSquareText size={21} />
      <div><b>Cinq réponses courtes suffisent pour C5.</b><p>Décrivez une adoption réaliste pour votre contexte. Il n’est pas nécessaire de produire un plan de communication complexe.</p></div>
    </div>
    <div className="fs-grid two">
      <Field label="Personnes concernées" hint="Qui utilise, valide ou subit les effets ?" value={form.audiences} onChange={(value) => update("audiences", value)} placeholder="Ex. équipe RH utilisatrice, managers valideurs et salariés concernés." />
      <Field label="Message essentiel" value={form.keyMessage} onChange={(value) => update("keyMessage", value)} placeholder="Ex. l’IA prépare un brouillon ; la décision et la diffusion restent humaines." />
      <Field label="Information et supports" value={form.diffusionActions} onChange={(value) => update("diffusionActions", value)} placeholder="Ex. présentation de 20 minutes, fiche réflexe et rappel dans l’espace RH." />
      <Field label="Prise en main et assistance" value={form.trainingAndSupport} onChange={(value) => update("trainingAndSupport", value)} placeholder="Ex. démonstration sur cas fictif, puis référent RH joignable en cas de doute." />
      <Field label="Règles d’usage et sobriété" hint="Protection des données + un geste simple de sobriété." value={form.charterAndSobriety} onChange={(value) => update("charterAndSobriety", value)} placeholder="Ex. sources autorisées uniquement, validation avant diffusion et pas de régénération sans motif." />
    </div>
  </div>;
}

function Measurement({ form, update }) {
  const metrics = [
    ["Efficacité", "Temps ou délai de réalisation", "efficiencyBefore", "efficiencyAfter", "Ex. 45 min, ou « à mesurer sur 5 cas »", "Ex. 32 min observées"],
    ["Qualité", "Retouches, erreurs ou incidents", "qualityBefore", "qualityAfter", "Ex. 3 retouches par document", "Ex. 1 retouche par document"],
    ["Relation humaine", "Compréhension, satisfaction ou recours", "humanBefore", "humanAfter", "Ex. 4 sollicitations RH par semaine", "Ex. 2 sollicitations, sans blocage"],
  ];

  return <div className="fs-stack">
    <div className="fs-callout blue">
      <Gauge size={21} />
      <div><b>Une comparaison simple, pas un tableau de bord industriel.</b><p>Si le pilote n’a pas encore eu lieu, indiquez honnêtement la collecte prévue au lieu d’inventer une valeur.</p></div>
    </div>
    <div className="fs-metrics">
      {metrics.map(([title, subtitle, before, after, beforePlaceholder, afterPlaceholder]) => <article key={title}>
        <div className="fs-metric-title"><span>{title}</span><p>{subtitle}</p></div>
        <Field area={false} label="Avant / baseline" value={form[before]} onChange={(value) => update(before, value)} placeholder={beforePlaceholder} />
        <Field area={false} label="Après / observation prévue" value={form[after]} onChange={(value) => update(after, value)} placeholder={afterPlaceholder} />
      </article>)}
    </div>
    <div className="fs-grid two">
      <Field label="Collecte en une phrase" hint="Source, méthode, fréquence et responsable." value={form.collectionPlan} onChange={(value) => update("collectionPlan", value)} placeholder="Ex. le responsable RH relève chaque vendredi le temps et les retouches sur les 10 cas du pilote." />
      <Field label="Retour des personnes concernées" value={form.userFeedback} onChange={(value) => update("userFeedback", value)} placeholder="Ex. trois questions courtes après deux semaines et un point oral avec les utilisateurs." />
    </div>
  </div>;
}

function FinalDecision({ form, update, snapshot, exportDocument }) {
  return <div className="fs-stack">
    <div className="fs-decision-options">
      {["GO", "AJUSTER", "STOP"].map((choice) => <button
        type="button"
        key={choice}
        className={`${choice.toLowerCase()} ${form.decision === choice ? "selected" : ""}`}
        onClick={() => update("decision", choice)}
      ><span>{form.decision === choice && <Check size={15} />}</span><b>{choice}</b></button>)}
    </div>
    <div className="fs-grid two">
      <Field label="Pourquoi cette décision ?" value={form.decisionRationale} onChange={(value) => update("decisionRationale", value)} placeholder="Reliez votre décision aux tests, aux limites et aux mesures prévues." />
      <Field label="Prochaine action concrète" value={form.nextAction} onChange={(value) => update("nextAction", value)} placeholder="Ex. lancer un pilote de quatre semaines sur dix cas autorisés." />
      <Field area={false} type="date" label="Date de revue" value={form.reviewDate} onChange={(value) => update("reviewDate", value)} />
      <Field label="Quand suspendre ou revenir en arrière ?" value={form.stopRule} onChange={(value) => update("stopRule", value)} placeholder="Ex. donnée non autorisée, résultat discriminatoire ou contrôle humain impossible." />
    </div>
    <div className="fs-final-preview">
      <header><FileCheck2 size={21} /><div><b>Votre dossier final rassemble maintenant</b><p>Le contenu des Studios J1 et J2, puis vos compléments C4 et C5.</p></div></header>
      <div>
        <span><CheckCircle2 size={16} /> C1 · Cadrage</span>
        <span><CheckCircle2 size={16} /> C2 · Choix</span>
        <span><CheckCircle2 size={16} /> C3 · Conception & tests</span>
        <span><CheckCircle2 size={16} /> C4 · Mesure</span>
        <span><CheckCircle2 size={16} /> C5 · Adoption</span>
      </div>
      {!snapshot.c1.retainedProcess && <p className="fs-warning"><Info size={16} /> Le processus retenu n’a pas été retrouvé. Vous pouvez néanmoins exporter, puis compléter le Studio C1.</p>}
      <button type="button" onClick={exportDocument}><Download size={17} /> Exporter le dossier C1 à C5</button>
    </div>
  </div>;
}

function getCounts({ snapshot, j3 }) {
  const j1Values = [
    snapshot.c1.organisation, snapshot.c1.problem, snapshot.c1.retainedProcess,
    snapshot.c1.retainedOpportunity, snapshot.c1.arbitration, snapshot.c1.objective,
    snapshot.c1.baseline, snapshot.c1.target, snapshot.c1.perimeter,
    snapshot.c1.outOfScope, snapshot.c1.humanDecision,
    ...snapshot.c1.legalReferences,
    ...snapshot.c1.risks.flat(),
  ];
  const j2Values = [
    snapshot.c2.solutionA?.name, snapshot.c2.solutionA?.source,
    snapshot.c2.solutionB?.name, snapshot.c2.solutionB?.source,
    snapshot.c2.conditionalChoice, snapshot.c3.promptV1, snapshot.c3.promptV2,
    snapshot.c3.controlPrompt, snapshot.c3.accessibilityRequirement,
    snapshot.c3.authorizedData, snapshot.c3.forbiddenData, snapshot.c3.j2Decision,
    snapshot.c3.j2Justification, snapshot.c3.identifiedLimit,
    ...Object.values(snapshot.c3.tests || {}).flatMap((test) => [test?.expected, test?.observed, test?.adjustment]),
  ];
  const j3Values = Object.values(j3);
  return {
    j1: j1Values.filter((value) => String(value || "").trim()).length,
    j2: j2Values.filter((value) => String(value || "").trim()).length,
    j3: j3Values.filter((value) => String(value || "").trim()).length,
    totalJ3: j3Values.length,
  };
}

function Text({ label, value }) {
  return <p><b>{label} :</b> {value || "À compléter"}</p>;
}

function PrintDocument({ snapshot, form }) {
  const tests = Object.entries(snapshot.c3.tests || {});
  return <section className="fs-print">
    <header>
      <p>FORMATION IA & RH · DOSSIER FINAL</p>
      <h1>Projet professionnel — synthèse C1 à C5</h1>
      <Text label="Organisation / contexte" value={snapshot.c1.organisation} />
      <Text label="Processus RH retenu" value={snapshot.c1.retainedProcess} />
    </header>

    <section>
      <h2>C1 — Cadrer le projet</h2>
      <Text label="Problème observé" value={snapshot.c1.problem} />
      {snapshot.c1.processes.map((process, index) => <Text key={index} label={`Opportunité ${index + 1} — ${process.name}`} value={process.opportunity} />)}
      <Text label="Arbitrage" value={snapshot.c1.arbitration} />
      <Text label="Objectif" value={snapshot.c1.objective} />
      <Text label="Baseline et cible" value={[snapshot.c1.baseline, snapshot.c1.target, snapshot.c1.horizon].filter(Boolean).join(" → ")} />
      <Text label="Périmètre" value={snapshot.c1.perimeter} />
      <Text label="Hors périmètre" value={snapshot.c1.outOfScope} />
      <Text label="Décision restant humaine" value={snapshot.c1.humanDecision} />
      {snapshot.c1.risks.map(([risk, prevention], index) => (risk || prevention) && <Text key={index} label={`Risque ${index + 1} / prévention`} value={[risk, prevention].filter(Boolean).join(" — ")} />)}
      <Text label="Références mobilisées" value={snapshot.c1.legalReferences.join(" · ")} />
    </section>

    <section>
      <h2>C2 — Comparer et choisir</h2>
      <SolutionPrint label="Solution A" solution={snapshot.c2.solutionA} />
      <SolutionPrint label="Solution B" solution={snapshot.c2.solutionB} />
      <Text label="Choix conditionnel" value={snapshot.c2.conditionalChoice} />
      <Text label="Responsable de vérification" value={snapshot.c2.verificationOwner} />
    </section>

    <section>
      <h2>C3 — Concevoir et tester</h2>
      <Text label="Prompt V1" value={snapshot.c3.promptV1} />
      <Text label="Critique et évolution V1 → V2" value={[snapshot.c3.critiqueV1, snapshot.c3.versionChanges].filter(Boolean).join(" — ")} />
      <Text label="Prompt V2" value={snapshot.c3.promptV2} />
      <Text label="Prompt de contrôle" value={snapshot.c3.controlPrompt} />
      <Text label="Accessibilité" value={snapshot.c3.accessibilityRequirement} />
      <Text label="Données autorisées" value={snapshot.c3.authorizedData} />
      <Text label="Données exclues" value={snapshot.c3.forbiddenData} />
      {tests.map(([key, test]) => <div className="fs-print-test" key={key}>
        <h3>Test {TEST_LABELS[key] || key}</h3>
        <Text label="Attendu" value={test.expected} />
        <Text label="Observé" value={test.observed} />
        <Text label="Ajustement" value={test.adjustment} />
      </div>)}
    </section>

    <section>
      <h2>C4 — Mesurer les effets</h2>
      <MetricPrint label="Efficacité" before={form.efficiencyBefore} after={form.efficiencyAfter} />
      <MetricPrint label="Qualité" before={form.qualityBefore} after={form.qualityAfter} />
      <MetricPrint label="Relation humaine" before={form.humanBefore} after={form.humanAfter} />
      <Text label="Organisation de la collecte" value={form.collectionPlan} />
      <Text label="Retour des personnes concernées" value={form.userFeedback} />
    </section>

    <section>
      <h2>C5 — Accompagner l’adoption</h2>
      <Text label="Personnes concernées" value={form.audiences} />
      <Text label="Message essentiel" value={form.keyMessage} />
      <Text label="Information et supports" value={form.diffusionActions} />
      <Text label="Prise en main et assistance" value={form.trainingAndSupport} />
      <Text label="Règles d’usage et sobriété" value={form.charterAndSobriety} />
    </section>

    <section className="fs-print-decision">
      <h2>Décision finale</h2>
      <Text label="Décision" value={form.decision} />
      <Text label="Justification" value={form.decisionRationale} />
      <Text label="Prochaine action" value={form.nextAction} />
      <Text label="Date de revue" value={form.reviewDate} />
      <Text label="Règle d’arrêt" value={form.stopRule} />
      <Text label="Responsable humain" value={snapshot.c3.humanOwner} />
    </section>
  </section>;
}

function SolutionPrint({ label, solution = {} }) {
  return <div className="fs-print-solution">
    <h3>{label} — {solution.name || "À compléter"}</h3>
    <Text label="Source / date" value={[solution.source, solution.date].filter(Boolean).join(" · ")} />
    <Text label="Éléments confirmés" value={solution.confirmed} />
    <Text label="À confirmer" value={solution.toConfirm} />
  </div>;
}

function MetricPrint({ label, before, after }) {
  return <p><b>{label} :</b> avant — {before || "À collecter"} · après — {after || "À observer"}</p>;
}
