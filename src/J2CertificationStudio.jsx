/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowLeft, ArrowRight, BadgeCheck, Check, CheckCircle2,
  ClipboardCheck, Download, FileCheck2, FileText, FolderCheck, Save,
  ShieldCheck, Sparkles, TestTube2, UserCheck,
} from "lucide-react";
import "./J2CertificationStudio.css";

const STORAGE_KEY = "ia-rh-j2-certification-studio";
const TESTS = [
  ["normal", "Normal"],
  ["limit", "Limite"],
  ["forbidden", "Interdit"],
  ["accessibility", "Accessibilité"],
  ["bias", "Biais & équité"],
];
const STEPS = [
  ["Projet", FileText, "Reprendre les repères utiles du J1."],
  ["Solutions", ClipboardCheck, "Consolider la comparaison sourcée."],
  ["Prototype", Sparkles, "Archiver les prompts et l’accessibilité."],
  ["Données & tests", TestTube2, "Rassembler les observations essentielles."],
  ["Décision", UserCheck, "Formaliser la décision humaine et datée."],
  ["Contrôle & export", FolderCheck, "Vérifier puis produire les preuves."],
];

const emptySolution = { name: "", source: "", date: "", confirmed: "", toConfirm: "" };
const emptyTest = { expected: "", observed: "", adjustment: "" };
const defaultForm = {
  context: "", process: "", problem: "", objective: "", baseline: "", perimeter: "",
  outOfScope: "", humanDecision: "",
  solutionA: { ...emptySolution }, solutionB: { ...emptySolution },
  conditionalChoice: "", verificationOwner: "",
  promptV1: "", critiqueV1: "", promptV2: "", controlPrompt: "",
  accessibilityRequirement: "", versionChanges: "",
  authorizedData: "", forbiddenData: "", dataToConfirm: "", testData: "",
  tests: Object.fromEntries(TESTS.map(([key]) => [key, { ...emptyTest }])),
  decision: "", justification: "", identifiedLimit: "", humanOwner: "",
  nextAction: "", reviewDate: "", restartCondition: "",
};

function loadForm() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      ...defaultForm, ...saved,
      solutionA: { ...emptySolution, ...saved.solutionA },
      solutionB: { ...emptySolution, ...saved.solutionB },
      tests: Object.fromEntries(TESTS.map(([key]) => [key, { ...emptyTest, ...saved.tests?.[key] }])),
    };
  } catch {
    return defaultForm;
  }
}

export function J2CertificationStudio({ back }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(loadForm);
  const [exportMode, setExportMode] = useState("complete");
  const [exported, setExported] = useState(false);
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(form)), [form]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateSolution = (key, field, value) => setForm((current) => ({
    ...current, [key]: { ...current[key], [field]: value },
  }));
  const updateTest = (key, field, value) => setForm((current) => ({
    ...current, tests: { ...current.tests, [key]: { ...current.tests[key], [field]: value } },
  }));
  const issues = useMemo(() => inspectForm(form), [form]);
  const filled = useMemo(() => countFilled(form), [form]);
  const exportDocument = (mode) => {
    setExportMode(mode);
    setExported(true);
    window.setTimeout(() => window.print(), 80);
  };

  return <main className="cs2-shell">
    <header className="cs2-topbar">
      <button className="cs2-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 2</button>
      <div className="cs2-brand"><span><FolderCheck size={17} /></span> Studio Certification J2</div>
      <div className="cs2-save"><Save size={15} /> Sauvegarde locale</div>
    </header>

    <section className="cs2-hero">
      <div className="cs2-hero-image" role="img" aria-label="Dossier professionnel et pièces de certification organisés sur un bureau" />
      <div className="cs2-hero-content">
        <p className="cs2-eyebrow">JOUR 2 · FINALISATION · 16 H / 16 H 30</p>
        <h1>Vos travaux deviennent<br /><span>un dossier défendable.</span></h1>
        <p>Rassemblez uniquement ce que vous avez réellement produit. Le Studio vérifie la structure et les preuves ; il ne crée ni source, ni résultat, ni décision.</p>
        <div className="cs2-pills"><span><ShieldCheck size={15} /> Aucune donnée personnelle réelle</span><span><BadgeCheck size={15} /> 4 preuves certificatives</span></div>
      </div>
    </section>

    <section className="cs2-layout">
      <aside className="cs2-stepper">
        <p>VOTRE DOSSIER</p>
        {STEPS.map(([label, Icon], index) => <button key={label} className={index === step ? "active" : index < step ? "done" : ""} onClick={() => setStep(index)}><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{String(index + 1).padStart(2, "0")}</b>{label}</button>)}
        <div className="cs2-mini"><FolderCheck size={16} /><p><b>{filled} éléments renseignés</b><br />{issues.length ? `${issues.length} point${issues.length > 1 ? "s" : ""} à vérifier` : "Contrôle méthodologique complet"}</p></div>
      </aside>

      <section className="cs2-workspace">
        <div className="cs2-step-heading"><span>ÉTAPE {step + 1} / 6</span><div><h2>{STEPS[step][0]}</h2><p>{STEPS[step][2]}</p></div></div>
        {step === 0 && <Project form={form} update={update} />}
        {step === 1 && <Solutions form={form} update={update} updateSolution={updateSolution} />}
        {step === 2 && <Prototype form={form} update={update} />}
        {step === 3 && <DataAndTests form={form} update={update} updateTest={updateTest} />}
        {step === 4 && <Decision form={form} update={update} />}
        {step === 5 && <Control issues={issues} form={form} exportDocument={exportDocument} />}
        <div className="cs2-actions">
          <button className="cs2-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Précédent</button>
          {step < 5 && <button className="cs2-primary" onClick={() => setStep((current) => current + 1)}>Continuer <ArrowRight size={17} /></button>}
        </div>
        {exported && step === 5 && <p className="cs2-exported"><CheckCircle2 size={17} /> Dans la fenêtre d’impression, choisissez « Enregistrer au format PDF ».</p>}
      </section>

      <aside className="cs2-live">
        <div className="cs2-live-image" />
        <div className="cs2-live-body">
          <div className="cs2-live-label"><span /> DOSSIER J2</div>
          <h3>{form.process || "Projet à identifier"}</h3>
          <p>{form.objective || "Votre objectif réel apparaîtra ici."}</p>
          <div className="cs2-live-row"><b>Solutions</b><span>{[form.solutionA.name, form.solutionB.name].filter(Boolean).length} / 2</span></div>
          <div className="cs2-live-row"><b>Tests documentés</b><span>{TESTS.filter(([key]) => form.tests[key].observed).length} / 5</span></div>
          <div className={`cs2-live-decision ${form.decision.toLowerCase()}`}><span>Décision humaine</span><b>{form.decision || "À décider"}</b></div>
          <div className="cs2-human"><UserCheck size={16} /><span>Responsable<br /><b>{form.humanOwner || "À nommer"}</b></span></div>
        </div>
      </aside>
    </section>
    <PrintDocument mode={exportMode} form={form} issues={issues} />
  </main>;
}

function Field({ label, hint, value, onChange, placeholder, area = false, type = "text" }) {
  const Input = area ? "textarea" : "input";
  return <label className="cs2-field"><span>{label}{hint && <small>{hint}</small>}</span><Input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function Project({ form, update }) {
  return <div className="cs2-stack">
    <div className="cs2-safety"><ShieldCheck size={21} /><div><b>Projet réel, informations maîtrisées.</b><p>Décrivez le processus sans coller de donnée personnelle, sensible ou confidentielle non autorisée. Une baseline absente reste « à collecter » : elle n’est jamais inventée.</p></div></div>
    <div className="cs2-grid two">
      <Field label="Organisation ou contexte" value={form.context} onChange={(v) => update("context", v)} placeholder="Ex. service RH d’une organisation de 300 salariés" />
      <Field label="Processus RH retenu" value={form.process} onChange={(v) => update("process", v)} placeholder="Ex. préparation des offres d’emploi" />
      <Field area label="Problème observé" value={form.problem} onChange={(v) => update("problem", v)} placeholder="Décrivez un fait ou un irritant observé." />
      <Field area label="Objectif" value={form.objective} onChange={(v) => update("objective", v)} placeholder="Formulez le résultat métier recherché." />
      <Field label="Baseline réelle ou méthode de collecte prévue" value={form.baseline} onChange={(v) => update("baseline", v)} placeholder="Ex. 40 min par offre, ou mesure à réaliser sur 10 offres" />
      <Field area label="Périmètre" value={form.perimeter} onChange={(v) => update("perimeter", v)} placeholder="Tâches assistées, publics et limites du test." />
      <Field area label="Hors périmètre" value={form.outOfScope} onChange={(v) => update("outOfScope", v)} placeholder="Décisions, données ou usages explicitement exclus." />
      <Field area label="Décision qui reste humaine" value={form.humanDecision} onChange={(v) => update("humanDecision", v)} placeholder="Ex. validation et publication de l’offre par le responsable recrutement." />
    </div>
  </div>;
}

function SolutionCard({ title, solution, update }) {
  return <article className="cs2-solution">
    <h3>{title}</h3>
    <Field label="Nom exact de la solution" value={solution.name} onChange={(v) => update("name", v)} placeholder="Nom réel, sans promesse inventée" />
    <Field label="Source identifiable" value={solution.source} onChange={(v) => update("source", v)} placeholder="Documentation, site officiel, support daté…" />
    <Field label="Date d’observation" type="date" value={solution.date} onChange={(v) => update("date", v)} />
    <Field area label="Informations confirmées" value={solution.confirmed} onChange={(v) => update("confirmed", v)} placeholder="Uniquement ce que la source permet de confirmer." />
    <Field area label="Informations à confirmer" value={solution.toConfirm} onChange={(v) => update("toConfirm", v)} placeholder="Question, source ou personne chargée de vérifier." />
  </article>;
}

function Solutions({ form, update, updateSolution }) {
  return <div className="cs2-stack">
    <div className="cs2-grid two solutions"><SolutionCard title="Solution réelle A" solution={form.solutionA} update={(field, value) => updateSolution("solutionA", field, value)} /><SolutionCard title="Solution réelle B" solution={form.solutionB} update={(field, value) => updateSolution("solutionB", field, value)} /></div>
    <Field area label="Choix conditionnel formulé par le participant" hint="Le Studio ne sélectionne aucune solution." value={form.conditionalChoice} onChange={(v) => update("conditionalChoice", v)} placeholder="Nous retenons la solution… à condition que…" />
    <Field label="Responsable de la vérification" value={form.verificationOwner} onChange={(v) => update("verificationOwner", v)} placeholder="Nom ou fonction" />
  </div>;
}

function Prototype({ form, update }) {
  return <div className="cs2-stack">
    <div className="cs2-note"><Sparkles size={20} /><div><b>Collez les versions réellement travaillées.</b><p>Prompt Clinic reste l’atelier de conception. Ici, vous archivez le cheminement et rendez les évolutions visibles.</p></div></div>
    <Field area label="Prompt de production V1" value={form.promptV1} onChange={(v) => update("promptV1", v)} placeholder="Version initiale réellement testée" />
    <Field area label="Critique de la V1" value={form.critiqueV1} onChange={(v) => update("critiqueV1", v)} placeholder="Faiblesses, inventions, lacunes, format ou validation manquante…" />
    <Field area label="Prompt de production V2" value={form.promptV2} onChange={(v) => update("promptV2", v)} placeholder="Version corrigée et contrôlable" />
    <Field area label="Prompt de contrôle distinct" value={form.controlPrompt} onChange={(v) => update("controlPrompt", v)} placeholder="Critères de contrôle, écarts à signaler et format de restitution" />
    <div className="cs2-grid two"><Field area label="Exigence d’accessibilité testable" value={form.accessibilityRequirement} onChange={(v) => update("accessibilityRequirement", v)} placeholder="Ex. titres hiérarchisés et compréhension sans recours à la couleur seule." /><Field area label="Principaux changements V1 → V2" value={form.versionChanges} onChange={(v) => update("versionChanges", v)} placeholder="Source, contraintes, lacunes, format, validation humaine…" /></div>
  </div>;
}

function DataAndTests({ form, update, updateTest }) {
  return <div className="cs2-stack">
    <div className="cs2-grid two data"><Field area label="Données autorisées" value={form.authorizedData} onChange={(v) => update("authorizedData", v)} placeholder="Données fictives, synthétiques ou strictement autorisées." /><Field area label="Données interdites" value={form.forbiddenData} onChange={(v) => update("forbiddenData", v)} placeholder="Données personnelles, sensibles ou confidentielles exclues." /><Field area label="Données à confirmer" value={form.dataToConfirm} onChange={(v) => update("dataToConfirm", v)} placeholder="Information, interlocuteur et action de vérification." /><Field area label="Données effectivement utilisées pour les tests" value={form.testData} onChange={(v) => update("testData", v)} placeholder="Décrivez uniquement la nature des données, sans coller leur contenu." /></div>
    <div className="cs2-tests"><div><h3>Cinq catégories de test</h3><p>Une synthèse courte suffit : attendu, observé, ajustement.</p></div>{TESTS.map(([key, label]) => <article key={key}><span>{label}</span><Field area label="Attendu" value={form.tests[key].expected} onChange={(v) => updateTest(key, "expected", v)} placeholder="Ce que le test doit démontrer ou refuser." /><Field area label="Observé" value={form.tests[key].observed} onChange={(v) => updateTest(key, "observed", v)} placeholder="Fait réellement constaté." /><Field area label="Ajustement / trace" value={form.tests[key].adjustment} onChange={(v) => updateTest(key, "adjustment", v)} placeholder="Correction, responsable ou preuve conservée." /></article>)}</div>
  </div>;
}

function Decision({ form, update }) {
  return <div className="cs2-stack">
    <div className="cs2-decision-options">{["GO", "AJUSTER", "STOP"].map((choice) => <button type="button" key={choice} className={`${choice.toLowerCase()} ${form.decision === choice ? "selected" : ""}`} onClick={() => update("decision", choice)}><span>{form.decision === choice && <Check size={15} />}</span><b>{choice}</b></button>)}</div>
    <div className="cs2-grid two">
      <Field area label="Justification factuelle" value={form.justification} onChange={(v) => update("justification", v)} placeholder="Reliez la décision aux faits observés et aux critères." />
      <Field area label="Limite identifiée" value={form.identifiedLimit} onChange={(v) => update("identifiedLimit", v)} placeholder="Limite connue, risque résiduel ou prérequis manquant." />
      <Field label="Responsable humain" value={form.humanOwner} onChange={(v) => update("humanOwner", v)} placeholder="Nom ou fonction" />
      <Field area label="Prochaine action" value={form.nextAction} onChange={(v) => update("nextAction", v)} placeholder="Correction, nouveau test, validation ou préparation du pilote." />
      <Field label="Date de revue" type="date" value={form.reviewDate} onChange={(v) => update("reviewDate", v)} />
      <Field area label="Condition de reprise éventuelle" value={form.restartCondition} onChange={(v) => update("restartCondition", v)} placeholder="Particulièrement utile pour AJUSTER ou STOP." />
    </div>
    <div className="cs2-safety"><UserCheck size={21} /><div><b>La décision reste votre responsabilité.</b><p>Le Studio enregistre et met en forme le choix. Il ne recommande ni GO, ni AJUSTER, ni STOP.</p></div></div>
  </div>;
}

function Control({ issues, form, exportDocument }) {
  return <div className="cs2-control">
    <div className={`cs2-control-head ${issues.length ? "warning" : "ready"}`}>{issues.length ? <AlertTriangle size={23} /> : <CheckCircle2 size={23} />}<div><h3>{issues.length ? `${issues.length} point${issues.length > 1 ? "s" : ""} à vérifier avant export` : "Le contrôle méthodologique est complet"}</h3><p>Ce contrôle porte sur la structure du dossier, jamais sur sa conformité juridique.</p></div></div>
    {issues.length > 0 && <div className="cs2-issue-list">{issues.map((issue) => <button type="button" onClick={() => issue.step !== undefined && null} key={issue.message}><span>{issue.level === "critical" ? "!" : "?"}</span><div><b>{issue.title}</b><p>{issue.message}</p></div></button>)}</div>}
    <div className="cs2-export-grid">
      <button className="complete" onClick={() => exportDocument("complete")}><FileCheck2 size={21} /><div><b>Dossier J2 complet</b><span>Du choix de la solution à la décision de pilote</span></div><Download size={17} /></button>
      <button onClick={() => exportDocument("comparison")}><FileText size={19} /><div><b>1 · Comparaison sourcée C2</b><span>Solutions, sources et choix conditionnel</span></div><Download size={16} /></button>
      <button onClick={() => exportDocument("prompts")}><FileText size={19} /><div><b>2 · Prompts V1, V2 et contrôle</b><span>Versions, critique et accessibilité</span></div><Download size={16} /></button>
      <button onClick={() => exportDocument("data")}><FileText size={19} /><div><b>3 · Données et validations</b><span>Classement, usages et points à confirmer</span></div><Download size={16} /></button>
      <button onClick={() => exportDocument("tests")}><FileText size={19} /><div><b>4 · Tests et décision</b><span>Protocole, observations et décision humaine</span></div><Download size={16} /></button>
    </div>
    <p className="cs2-disclaimer"><ShieldCheck size={16} /> Les exports reprennent vos réponses telles qu’elles sont enregistrées. Aucune rubrique vide n’est complétée automatiquement.</p>
  </div>;
}

function inspectForm(form) {
  const issues = [];
  const required = [["Contexte", "context"], ["Processus RH", "process"], ["Problème observé", "problem"], ["Objectif", "objective"], ["Périmètre", "perimeter"], ["Décision humaine préservée", "humanDecision"]];
  required.forEach(([label, key]) => { if (!form[key].trim()) issues.push({ level: "critical", title: "Champ essentiel manquant", message: `${label} doit être renseigné.` }); });
  if (!form.baseline.trim()) issues.push({ level: "critical", title: "Baseline absente", message: "Indiquez une valeur réelle ou la méthode prévue pour la collecter." });
  [["Solution A", form.solutionA], ["Solution B", form.solutionB]].forEach(([label, solution]) => {
    if (!solution.name.trim()) issues.push({ level: "critical", title: `${label} non identifiée`, message: "Le dossier doit comparer deux solutions réelles." });
    if (solution.source.trim() && !solution.date) issues.push({ level: "warning", title: "Source sans date", message: `${label} possède une source mais aucune date d’observation.` });
    if (solution.confirmed.trim() && !solution.source.trim()) issues.push({ level: "critical", title: "Information confirmée sans source", message: `${label} contient une information confirmée sans source identifiable.` });
  });
  const forbidden = terms(form.forbiddenData);
  const used = terms(form.testData);
  const overlap = forbidden.filter((term) => used.includes(term));
  if (overlap.length) issues.push({ level: "critical", title: "Contradiction sur les données", message: `Des éléments interdits semblent aussi déclarés utilisés : ${overlap.slice(0, 3).join(", ")}.` });
  if (!form.decision) issues.push({ level: "critical", title: "Décision absente", message: "GO, AJUSTER ou STOP doit être choisi par le participant." });
  if (form.decision && !form.justification.trim()) issues.push({ level: "critical", title: "Décision sans justification", message: "La décision doit être reliée aux faits observés." });
  if (!form.humanOwner.trim()) issues.push({ level: "critical", title: "Responsable humain absent", message: "Nommez la fonction ou la personne responsable de la décision." });
  if (TESTS.some(([key]) => !form.tests[key].observed.trim())) issues.push({ level: "warning", title: "Tests incomplets", message: "Une ou plusieurs catégories ne comportent pas encore de résultat observé." });
  return issues;
}

function terms(value) {
  return value.toLowerCase().split(/[,;\n]/).map((item) => item.trim()).filter((item) => item.length > 3);
}

function countFilled(value) {
  if (typeof value === "string") return value.trim() ? 1 : 0;
  if (!value || typeof value !== "object") return 0;
  return Object.values(value).reduce((total, item) => total + countFilled(item), 0);
}

function Text({ label, value }) {
  return <p><b>{label} :</b> {value || "—"}</p>;
}

function ComparisonProof({ form }) {
  return <><h2>1. Comparaison sourcée C2</h2><h3>Solution A — {form.solutionA.name || "—"}</h3><Text label="Source et date" value={[form.solutionA.source, form.solutionA.date].filter(Boolean).join(" · ")} /><Text label="Confirmé" value={form.solutionA.confirmed} /><Text label="À confirmer" value={form.solutionA.toConfirm} /><h3>Solution B — {form.solutionB.name || "—"}</h3><Text label="Source et date" value={[form.solutionB.source, form.solutionB.date].filter(Boolean).join(" · ")} /><Text label="Confirmé" value={form.solutionB.confirmed} /><Text label="À confirmer" value={form.solutionB.toConfirm} /><Text label="Décision conditionnelle" value={form.conditionalChoice} /><Text label="Responsable de vérification" value={form.verificationOwner} /></>;
}

function PromptsProof({ form }) {
  return <><h2>2. Prompts V1, V2 et contrôle</h2><Text label="Prompt V1" value={form.promptV1} /><Text label="Critique de la V1" value={form.critiqueV1} /><Text label="Prompt V2" value={form.promptV2} /><Text label="Prompt de contrôle" value={form.controlPrompt} /><Text label="Changements V1 → V2" value={form.versionChanges} /><Text label="Exigence d’accessibilité" value={form.accessibilityRequirement} /></>;
}

function DataProof({ form }) {
  return <><h2>3. Données et validations</h2><Text label="Données autorisées" value={form.authorizedData} /><Text label="Données interdites" value={form.forbiddenData} /><Text label="Données à confirmer" value={form.dataToConfirm} /><Text label="Données utilisées dans les tests" value={form.testData} /><Text label="Décision restant humaine" value={form.humanDecision} /></>;
}

function TestsProof({ form }) {
  return <><h2>4. Protocole de test et décision</h2>{TESTS.map(([key, label]) => <section className="cs2-print-test" key={key}><h3>{label}</h3><Text label="Attendu" value={form.tests[key].expected} /><Text label="Observé" value={form.tests[key].observed} /><Text label="Ajustement / trace" value={form.tests[key].adjustment} /></section>)}<h3>Décision finale : {form.decision || "—"}</h3><Text label="Justification" value={form.justification} /><Text label="Limite" value={form.identifiedLimit} /><Text label="Responsable humain" value={form.humanOwner} /><Text label="Prochaine action" value={form.nextAction} /><Text label="Date de revue" value={form.reviewDate} /><Text label="Condition de reprise" value={form.restartCondition} /></>;
}

function PrintDocument({ mode, form, issues }) {
  return <section className="cs2-print-summary">
    <header><p>FORMATION CERTIFIANTE · IA & RH · JOUR 2</p><h1>{mode === "complete" ? "Dossier J2 — Du choix de la solution à la décision de pilote" : { comparison: "Comparaison sourcée C2", prompts: "Prompts V1, V2 et contrôle", data: "Données et validations", tests: "Protocole de test et décision" }[mode]}</h1></header>
    {(mode === "complete") && <><h2>Identité du projet</h2><Text label="Contexte" value={form.context} /><Text label="Processus RH" value={form.process} /><Text label="Problème observé" value={form.problem} /><Text label="Objectif" value={form.objective} /><Text label="Baseline / méthode" value={form.baseline} /><Text label="Périmètre" value={form.perimeter} /><Text label="Hors périmètre" value={form.outOfScope} /><Text label="Décision humaine préservée" value={form.humanDecision} /></>}
    {(mode === "complete" || mode === "comparison") && <ComparisonProof form={form} />}
    {(mode === "complete" || mode === "prompts") && <PromptsProof form={form} />}
    {(mode === "complete" || mode === "data") && <DataProof form={form} />}
    {(mode === "complete" || mode === "tests") && <TestsProof form={form} />}
    {mode === "complete" && <><h2>Contrôle méthodologique avant export</h2>{issues.length ? <ul>{issues.map((issue) => <li key={issue.message}>{issue.title} — {issue.message}</li>)}</ul> : <p>Aucun champ essentiel ou incohérence simple détecté. Ce contrôle ne constitue pas une validation juridique.</p>}</>}
    <footer>Document généré à partir des réponses validées par le participant. Aucune information professionnelle n’a été inventée par le Studio.</footer>
  </section>;
}
