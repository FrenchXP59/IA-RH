/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Check,
  CheckCircle2, CircleAlert, CircleCheck, CircleX, ClipboardCheck, Download,
  Flag, Gauge, Lightbulb, Save, ShieldCheck, Target, UsersRound,
} from "lucide-react";

const steps = [
  ["Périmètre", Target],
  ["Garde-fous", ShieldCheck],
  ["Mesurer", Gauge],
  ["Arbitrer", Activity],
  ["Feuille de route", ClipboardCheck],
];

const defaultForm = {
  project: "", audience: "", task: "", duration: "4 semaines", sample: "",
  owner: "", reviewDate: "", stopRule: "", humanControl: "yes", dataFrame: "controlled",
  efficiencyBaseline: "", efficiencyTarget: "", qualityBaseline: "", qualityTarget: "",
  humanBaseline: "", humanTarget: "", decisionNote: "", nextAction: "",
};

export function PilotRoom({ back }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    try { return { ...defaultForm, ...JSON.parse(localStorage.getItem("ia-rh-pilot-room") || "{}").form }; }
    catch { return defaultForm; }
  });
  const [exported, setExported] = useState(false);
  useEffect(() => localStorage.setItem("ia-rh-pilot-room", JSON.stringify({ form })), [form]);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const required = ["project", "audience", "task", "sample", "owner", "reviewDate", "stopRule", "efficiencyBaseline", "efficiencyTarget", "qualityBaseline", "qualityTarget", "humanBaseline", "humanTarget"];
  const filled = required.filter((field) => form[field]).length;
  const readiness = useMemo(() => assess(form, required), [form]);

  return <main className="pr-shell">
    <header className="pr-topbar"><button className="pr-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 3</button><div className="pr-brand"><span><Activity size={17} /></span> Pilot Room</div><div className="pr-save"><Save size={15} /> Sauvegarde locale</div></header>
    <section className="pr-hero"><div className="pr-hero-image" role="img" aria-label="Professionnels réunis autour d’un tableau de bord pour préparer un pilote IA et RH" /><div className="pr-hero-content"><p className="pr-eyebrow">JOUR 3 · SIMULATEUR DE PILOTE</p><h1>Un pilote utile,<br /><span>mesuré et réversible.</span></h1><p>Transformez votre idée en expérimentation limitée : périmètre, personnes responsables, indicateurs, date de revue et règle d’arrêt.</p><div className="pr-pills"><span><ShieldCheck size={15} /> Décision humaine</span><span><BadgeCheck size={15} /> 5 étapes guidées</span></div></div></section>
    <section className="pr-layout">
      <aside className="pr-stepper"><p>VOTRE PILOTE</p>{steps.map(([label, Icon], index) => <button className={index === step ? "active" : index < step ? "done" : ""} onClick={() => setStep(index)} key={label}><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{String(index + 1).padStart(2, "0")}</b>{label}</button>)}<div className={`pr-mini-status ${readiness.status}`}><span /><div><b>{readiness.label}</b><small>{filled} / {required.length} repères renseignés</small></div></div></aside>
      <section className="pr-workspace"><div className="pr-step-heading"><span>ÉTAPE {step + 1} / 5</span><div><h2>{steps[step][0]}</h2><p>{descriptions[step]}</p></div></div>
        {step === 0 && <Scope form={form} update={update} />}
        {step === 1 && <Safeguards form={form} update={update} />}
        {step === 2 && <Metrics form={form} update={update} />}
        {step === 3 && <Decision form={form} update={update} readiness={readiness} />}
        {step === 4 && <Roadmap form={form} update={update} readiness={readiness} />}
        <div className="pr-actions"><button className="pr-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Précédent</button>{step < 4 ? <button className="pr-primary" onClick={() => setStep((current) => current + 1)}>Continuer <ArrowRight size={17} /></button> : <button className="pr-primary" onClick={() => { setExported(true); window.print(); }}><Download size={17} /> Exporter la fiche pilote</button>}</div>{exported && <p className="pr-exported"><CheckCircle2 size={17} /> Votre feuille de route est prête. Dans la fenêtre d’impression, choisissez « Enregistrer au format PDF ».</p>}
      </section>
      <aside className="pr-live"><div className="pr-live-image" /><div className="pr-live-body"><div className="pr-live-label"><span /> APERÇU DU PILOTE</div><h3>{form.project || "Votre projet IA & RH"}</h3><p>{form.task || "La tâche concernée apparaîtra ici."}</p><div className="pr-live-row"><b>Périmètre</b><span>{form.sample || "À préciser"}</span></div><div className="pr-live-row"><b>Responsable</b><span>{form.owner || "À préciser"}</span></div><div className={`pr-live-decision ${readiness.status}`}><span>Décision de préparation</span><b>{readiness.short}</b></div><div className="pr-human"><ShieldCheck size={16} /><span>Point de revue<br /><b>{form.reviewDate || "à planifier"}</b></span></div></div></aside>
    </section>
    <PrintSummary form={form} readiness={readiness} />
  </main>;
}

const descriptions = [
  "Un pilote n’est pas un déploiement général : limitez clairement les personnes, les cas et la durée de l’essai.",
  "Précisez qui garde la décision, les données admises et la règle qui impose de suspendre ou de corriger l’expérimentation.",
  "Suivez à la fois l’efficacité, la qualité et la relation humaine. Une amélioration ne se résume pas à du temps gagné.",
  "La décision proposée est un repère pédagogique : elle aide à préparer un arbitrage, elle ne remplace pas le responsable du projet.",
  "Votre feuille de route rassemble les conditions de départ, de suivi et de décision pour une expérimentation responsable.",
];

function Field({ label, hint, value, onChange, placeholder, area = false }) { const Input = area ? "textarea" : "input"; return <label className="pr-field"><span>{label}{hint && <small>{hint}</small>}</span><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>; }
function Chips({ title, choices, value, change }) { return <div className="pr-chips"><b>{title}</b><div>{choices.map((choice) => <button className={choice === value ? "selected" : ""} onClick={() => change(choice)} type="button" key={choice}>{choice}</button>)}</div></div>; }

function Scope({ form, update }) { return <div className="pr-grid two"><Field label="Nom du pilote" value={form.project} onChange={(value) => update("project", value)} placeholder="Ex. brouillons d’offres d’emploi" /><Field label="Personnes concernées" value={form.audience} onChange={(value) => update("audience", value)} placeholder="Ex. 2 recruteurs et 1 manager volontaire" /><Field area label="Tâche assistée" hint="Décrivez la tâche, jamais une décision sur une personne." value={form.task} onChange={(value) => update("task", value)} placeholder="Ex. préparer un premier brouillon à partir d’une fiche de poste validée." /><Field area label="Périmètre de l’essai" value={form.sample} onChange={(value) => update("sample", value)} placeholder="Ex. cinq offres fictives ou anonymisées, sans analyse ni tri automatique de CV." /><Chips title="Durée initiale" choices={["2 semaines", "4 semaines", "6 semaines"]} value={form.duration} change={(value) => update("duration", value)} /></div>; }

function Safeguards({ form, update }) { return <div className="pr-guard-stage"><div className="pr-callout"><ShieldCheck size={20} /><div><b>Un pilote est réversible dès sa conception.</b><p>La règle d’arrêt protège les personnes, la qualité et la confiance : elle ne doit pas attendre un incident pour exister.</p></div></div><Field label="Responsable du pilote" value={form.owner} onChange={(value) => update("owner", value)} placeholder="Ex. responsable recrutement" /><Field label="Date de revue" value={form.reviewDate} onChange={(value) => update("reviewDate", value)} placeholder="Ex. 12 novembre 2026" /><Field area label="Règle d’arrêt ou de suspension" value={form.stopRule} onChange={(value) => update("stopRule", value)} placeholder="Ex. suspendre le pilote en cas de donnée non autorisée, de formulation discriminatoire ou de perte de contrôle humain." /><div className="pr-choice-grid"><Choice title="Décision humaine" value={form.humanControl} change={(value) => update("humanControl", value)} options={[["yes", "Une personne valide avant diffusion"], ["no", "La décision serait automatique"]]} /><Choice title="Données et outil" value={form.dataFrame} change={(value) => update("dataFrame", value)} options={[["controlled", "Cas fictif ou données autorisées"], ["uncontrolled", "Cadre non maîtrisé"]]} /></div></div>; }

function Choice({ title, value, change, options }) { return <div className="pr-choice"><b>{title}</b>{options.map(([key, label]) => <button className={value === key ? `selected ${key}` : ""} onClick={() => change(key)} type="button" key={key}><span>{value === key ? <Check size={14} /> : ""}</span>{label}</button>)}</div>; }

function Metrics({ form, update }) { const items = [["Efficacité", "Temps, délai ou volume", "efficiencyBaseline", "efficiencyTarget", "Ex. 45 min / offre", "Ex. 30 min / offre"], ["Qualité", "Retouches, erreurs ou incidents", "qualityBaseline", "qualityTarget", "Ex. 35 % de retouches", "Ex. moins de 15 %"], ["Relation humaine", "Compréhension, satisfaction ou recours", "humanBaseline", "humanTarget", "Ex. 2 questions / essai", "Ex. aucun blocage non traité"]]; return <div className="pr-metrics"><div className="pr-callout blue"><Gauge size={20} /><div><b>Mesurer trois dimensions évite un gain trompeur.</b><p>Un test plus rapide qui augmente les retouches ou les sollicitations RH ne peut pas être considéré comme une réussite sans analyse.</p></div></div>{items.map(([title, description, baseline, target, basePlaceholder, targetPlaceholder]) => <article className="pr-metric-card" key={title}><div><span>{title}</span><p>{description}</p></div><Field label="Baseline" value={form[baseline]} onChange={(value) => update(baseline, value)} placeholder={basePlaceholder} /><Field label="Cible du pilote" value={form[target]} onChange={(value) => update(target, value)} placeholder={targetPlaceholder} /></article>)}</div>; }

function Decision({ form, update, readiness }) { const Icon = readiness.status === "go" ? CircleCheck : readiness.status === "stop" ? CircleX : CircleAlert; return <div className="pr-decision-stage"><div className={`pr-decision-result ${readiness.status}`}><Icon size={25} /><div><span>DÉCISION DE PRÉPARATION</span><b>{readiness.label}</b><p>{readiness.message}</p></div></div><div className="pr-decision-list"><h3>À vérifier avant de lancer</h3>{readiness.checks.map(([done, label]) => <p className={done ? "done" : ""} key={label}>{done ? <CheckCircle2 size={17} /> : <CircleAlert size={17} />}{label}</p>)}</div><Field area label="Justification ou point d’arbitrage" value={form.decisionNote} onChange={(value) => update("decisionNote", value)} placeholder="Ex. le pilote reste limité à la rédaction. La responsable recrutement valide chaque brouillon et la revue est fixée à quatre semaines." /></div>; }

function Roadmap({ form, update, readiness }) { return <div className="pr-roadmap"><div className={`pr-ready ${readiness.status}`}><BadgeCheck size={22} /><div><b>{readiness.label}</b><p>{readiness.message}</p></div></div><div className="pr-roadmap-grid"><article><span>01</span><b>Lancer</b><p>{form.duration} · {form.sample || "Périmètre à préciser"}</p></article><article><span>02</span><b>Suivre</b><p>Trois indicateurs : efficacité, qualité, relation humaine.</p></article><article><span>03</span><b>Revoir</b><p>{form.reviewDate || "Date à préciser"} · responsable : {form.owner || "à préciser"}</p></article><article><span>04</span><b>Décider</b><p>{form.stopRule || "Règle d’arrêt à préciser"}</p></article></div><Field area label="Prochaine action humaine" value={form.nextAction} onChange={(value) => update("nextAction", value)} placeholder="Ex. partager la fiche au sponsor, valider le jeu de test fictif et planifier la revue." /></div>; }

function assess(form, required) { const missing = required.filter((field) => !form[field]); if (form.humanControl === "no" || form.dataFrame === "uncontrolled") return { status: "stop", short: "STOP", label: "STOP — prérequis non maîtrisé", message: "La décision humaine ou le cadre des données n’est pas suffisamment maîtrisé. Le pilote ne doit pas démarrer en l’état.", checks: [[false, form.humanControl === "no" ? "Validation humaine à rétablir avant diffusion" : "Cadre des données et de l’outil à maîtriser"], [Boolean(form.stopRule), "Règle d’arrêt formalisée"], [Boolean(form.owner), "Responsable désigné"]] }; if (missing.length) return { status: "adjust", short: "AJUSTER", label: "AJUSTER — conditions à compléter", message: `${missing.length} repère${missing.length > 1 ? "s" : ""} reste${missing.length > 1 ? "nt" : ""} à préciser avant le lancement.`, checks: [[Boolean(form.sample), "Périmètre limité et explicite"], [Boolean(form.owner && form.reviewDate), "Responsable et date de revue"], [Boolean(form.stopRule), "Règle d’arrêt"], [Boolean(form.efficiencyBaseline && form.qualityBaseline && form.humanBaseline), "Baselines sur les trois dimensions"]] }; return { status: "go", short: "GO", label: "GO — pilote prêt à être encadré", message: "Les conditions essentielles sont réunies : le pilote peut démarrer de manière limitée, avec une revue et une décision humaine explicites.", checks: [[true, "Périmètre limité et explicite"], [true, "Responsable et date de revue"], [true, "Règle d’arrêt"], [true, "Baselines sur les trois dimensions"]] }; }

function PrintSummary({ form, readiness }) { return <section className="pr-print-summary"><h1>Pilot Room — Fiche pilote J3</h1><h2>Périmètre</h2><p><b>Projet :</b> {form.project || "Non renseigné"}<br /><b>Personnes :</b> {form.audience || "Non renseigné"}<br /><b>Tâche :</b> {form.task || "Non renseignée"}<br /><b>Périmètre :</b> {form.sample || "Non renseigné"}</p><h2>Garde-fous</h2><p><b>Responsable :</b> {form.owner || "À préciser"}<br /><b>Revue :</b> {form.reviewDate || "À préciser"}<br /><b>Règle d’arrêt :</b> {form.stopRule || "À préciser"}</p><h2>Mesure</h2><p><b>Efficacité :</b> {form.efficiencyBaseline || "—"} → {form.efficiencyTarget || "—"}<br /><b>Qualité :</b> {form.qualityBaseline || "—"} → {form.qualityTarget || "—"}<br /><b>Relation humaine :</b> {form.humanBaseline || "—"} → {form.humanTarget || "—"}</p><h2>Décision</h2><p><b>{readiness.label}</b><br />{form.decisionNote || form.nextAction || "À compléter"}</p></section>; }
