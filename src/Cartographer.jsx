import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Check,
  CircleAlert, CircleCheck, Download, FileCheck2, HeartHandshake,
  Lightbulb, MapPinned, Plus, Save, ShieldCheck, SlidersHorizontal,
  Sparkles, Target, Trash2, UsersRound,
} from "lucide-react";

const steps = [
  ["Contexte", BriefcaseBusiness],
  ["Processus", MapPinned],
  ["Prioriser", SlidersHorizontal],
  ["Vigilances", ShieldCheck],
  ["Périmètre", Target],
  ["Objectif", FileCheck2],
];

const defaultForm = {
  organisation: "", role: "", irritant: "", processA: "", processB: "",
  taskA: "", taskB: "", dataA: "", dataB: "", opportunityA: "", opportunityB: "",
  legalRisk: "", relationalRisk: "", prevention: "", included: "", excluded: "",
  validator: "", objective: "", baseline: "", target: "", horizon: "",
};

const scoreLabels = ["Très faible", "Faible", "Modéré", "Élevé", "Très élevé"];

export function Cartographer({ back }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    try { return { ...defaultForm, ...JSON.parse(localStorage.getItem("ia-rh-cartographer") || "{}").form }; }
    catch { return defaultForm; }
  });
  const [scores, setScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ia-rh-cartographer") || "{}").scores || { benefit: 3, feasibility: 3, risk: 3, acceptance: 3 }; }
    catch { return { benefit: 3, feasibility: 3, risk: 3, acceptance: 3 }; }
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => localStorage.setItem("ia-rh-cartographer", JSON.stringify({ form, scores })), [form, scores]);
  const readiness = useMemo(() => Math.max(0, scores.benefit + scores.feasibility + scores.acceptance - scores.risk), [scores]);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const complete = Object.values(form).filter(Boolean).length;

  return <main className="carto-shell">
    <header className="carto-topbar">
      <button className="carto-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 1</button>
      <div className="carto-brand"><span><MapPinned size={18} /></span> Cartographe des opportunités RH</div>
      <div className="carto-save"><Save size={15} /> Sauvegarde locale</div>
    </header>

    <section className="carto-hero">
      <div className="carto-hero-photo" role="img" aria-label="Professionnelle RH analysant une cartographie de processus" />
      <div className="carto-hero-content">
        <p className="carto-eyebrow">JOUR 1 · APPLICATION GUIDÉE</p>
        <h1>Votre usage IA &amp; RH,<br /><span>de l’idée au périmètre.</span></h1>
        <p>Construisez pas à pas la fiche C1 : un projet réaliste, utile et responsable, sans données personnelles réelles.</p>
        <div className="carto-pills"><span><ShieldCheck size={15} /> Données fictives ou autorisées</span><span><BadgeCheck size={15} /> 6 étapes guidées</span></div>
      </div>
    </section>

    <section className="carto-layout">
      <aside className="carto-side">
        <p>VOTRE PROGRESSION</p>
        {steps.map(([label, Icon], index) => <button className={index === step ? "active" : index < step ? "done" : ""} onClick={() => setStep(index)} key={label}><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{String(index + 1).padStart(2, "0")}</b>{label}</button>)}
        <div className="carto-side-note"><Sparkles size={16} /><p><b>{complete} repères renseignés</b> sur votre fiche C1.</p></div>
      </aside>

      <section className="carto-workspace">
        <div className="carto-step-heading"><span>ÉTAPE {step + 1} / 6</span><div><h2>{steps[step][0]}</h2><p>{stepText[step]}</p></div></div>
        {step === 0 && <Context form={form} update={update} />}
        {step === 1 && <Processes form={form} update={update} />}
        {step === 2 && <Prioritise scores={scores} setScores={setScores} readiness={readiness} />}
        {step === 3 && <Vigilances form={form} update={update} />}
        {step === 4 && <Scope form={form} update={update} />}
        {step === 5 && <Objective form={form} update={update} readiness={readiness} />}
        <div className="carto-actions">
          <button className="carto-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Précédent</button>
          {step < 5 ? <button className="carto-primary" onClick={() => setStep((current) => current + 1)}>Continuer <ArrowRight size={17} /></button> : <button className="carto-primary" onClick={() => { setSaved(true); window.print(); }}><Download size={17} /> Exporter la fiche C1</button>}
        </div>
        {saved && <p className="carto-saved"><CircleCheck size={17} /> Votre synthèse est prête. Choisissez « Enregistrer au format PDF » dans la fenêtre d’impression.</p>}
      </section>

      <aside className="carto-live">
        <div className="live-label"><span /> FICHE C1 · APERÇU EN DIRECT</div>
        <h3>{form.organisation || "Votre organisation"}</h3>
        <p>{form.irritant || "L’irritant RH à résoudre apparaîtra ici."}</p>
        <div className="live-section"><b><MapPinned size={15} /> Processus</b><span>{form.processA || "Processus n°1"}</span><span>{form.processB || "Processus n°2"}</span></div>
        <div className="live-section"><b><Lightbulb size={15} /> Opportunités</b><span>{form.opportunityA || "Opportunité n°1"}</span><span>{form.opportunityB || "Opportunité n°2"}</span></div>
        <div className="live-score"><span>Indice d’opportunité</span><strong>{readiness}<small> / 15</small></strong><i><b style={{ width: `${(readiness / 15) * 100}%` }} /></i></div>
        <div className="live-human"><HeartHandshake size={16} /><span>Décision humaine<br /><b>{form.validator || "À préciser"}</b></span></div>
      </aside>
    </section>
    <PrintSummary form={form} scores={scores} readiness={readiness} />
  </main>;
}

const stepText = [
  "Ancrez le sujet dans votre réalité métier, sans exposer de données personnelles.",
  "Décrivez deux processus RH : l’un pourra être retenu, l’autre différé.",
  "Comparez intérêt, faisabilité, risque et acceptabilité pour choisir avec discernement.",
  "Rendez visibles les risques éthiques, juridiques et relationnels avant toute expérimentation.",
  "Tracez une frontière claire : ce qui est testé, ce qui reste exclu et qui garde la main.",
  "Transformez l’intention en objectif mesurable, réaliste et utile au collectif.",
];

function Field({ label, hint, value, onChange, placeholder, area = false }) {
  const Input = area ? "textarea" : "input";
  return <label className="carto-field"><span>{label}{hint && <small>{hint}</small>}</span><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function Context({ form, update }) {
  return <div className="carto-grid two"><Field label="Organisation ou contexte" value={form.organisation} onChange={(value) => update("organisation", value)} placeholder="Ex. PME de 180 salariés, secteur services" /><Field label="Votre rôle dans ce processus" value={form.role} onChange={(value) => update("role", value)} placeholder="Ex. responsable RH, recruteur·se…" /><Field area label="Irritant observable" hint="Décrivez le problème, pas encore la solution." value={form.irritant} onChange={(value) => update("irritant", value)} placeholder="Ex. la rédaction des offres mobilise 4 h par semaine et les versions sont hétérogènes." /></div>;
}

function Processes({ form, update }) {
  return <div className="process-list">
    <ProcessCard number="01" tint="blue" name={form.processA} task={form.taskA} data={form.dataA} setName={(value) => update("processA", value)} setTask={(value) => update("taskA", value)} setData={(value) => update("dataA", value)} />
    <ProcessCard number="02" tint="coral" name={form.processB} task={form.taskB} data={form.dataB} setName={(value) => update("processB", value)} setTask={(value) => update("taskB", value)} setData={(value) => update("dataB", value)} />
  </div>;
}

function ProcessCard({ number, tint, name, task, data, setName, setTask, setData }) {
  return <article className={`process-card ${tint}`}><div className="process-number">{number}</div><div className="process-copy"><h3>Processus RH n°{number}</h3><p>Décrivez-le avec suffisamment de précision pour localiser un usage d’assistance, jamais une décision automatisée.</p></div><div className="process-fields"><Field label="Nom du processus" value={name} onChange={setName} placeholder="Ex. préparer et publier une offre" /><Field area label="Tâche répétitive ou chronophage" value={task} onChange={setTask} placeholder="Ex. harmoniser le brouillon, vérifier la structure, reformuler." /><Field area label="Données et vigilance" value={data} onChange={setData} placeholder="Ex. fiche de poste validée ; aucune donnée de candidat." /></div></article>;
}

function Prioritise({ scores, setScores, readiness }) {
  const items = [["benefit", "Bénéfice attendu", "Gain de qualité, temps, lisibilité ou service"], ["feasibility", "Faisabilité", "Moyens, outil autorisé, données accessibles"], ["risk", "Niveau de risque", "Données, biais, impact sur les personnes"], ["acceptance", "Acceptabilité", "Adhésion des équipes et clarté du rôle humain"]];
  return <div><div className="priority-intro"><SlidersHorizontal size={20} /><p>Attribuez une valeur de 1 à 5. Le risque vient volontairement réduire l’indice : un bon pilote est utile <em>et</em> maîtrisable.</p></div><div className="score-list">{items.map(([key, title, text]) => <div className="score-row" key={key}><div><b>{title}</b><span>{text}</span></div><div className="score-buttons">{scoreLabels.map((label, index) => <button aria-label={`${title} : ${label}`} className={scores[key] === index + 1 ? "selected" : ""} onClick={() => setScores((current) => ({ ...current, [key]: index + 1 }))} key={label}>{index + 1}</button>)}</div></div>)}</div><div className="priority-result"><span>Indice d’opportunité</span><strong>{readiness}<small> / 15</small></strong><p>{readiness >= 8 ? "Un pilote semble envisageable, sous réserve des mesures de prévention." : "Le sujet mérite d’être ajusté ou investigué avant de devenir un pilote."}</p></div></div>;
}

function Vigilances({ form, update }) {
  return <div><div className="caution-banner"><CircleAlert size={20} /><div><b>Un usage RH responsable ne se résume pas à la confidentialité.</b><p>Repérez aussi les effets potentiels sur l’égalité de traitement, la relation et la qualité de la décision.</p></div></div><div className="carto-grid two"><Field area label="Opportunité n°1" value={form.opportunityA} onChange={(value) => update("opportunityA", value)} placeholder="Ex. réduire le temps de premier brouillon d’une offre." /><Field area label="Opportunité n°2" value={form.opportunityB} onChange={(value) => update("opportunityB", value)} placeholder="Ex. homogénéiser la structure et améliorer la lisibilité." /><Field area label="Risque éthique ou juridique" value={form.legalRisk} onChange={(value) => update("legalRisk", value)} placeholder="Ex. formulation discriminatoire ou transmission de données non autorisées." /><Field area label="Risque relationnel" value={form.relationalRisk} onChange={(value) => update("relationalRisk", value)} placeholder="Ex. sentiment de déshumanisation du recrutement ou perte de confiance." /><Field area label="Mesure de prévention" value={form.prevention} onChange={(value) => update("prevention", value)} placeholder="Ex. données fictives, checklist inclusive, validation RH avant publication." /></div></div>;
}

function Scope({ form, update }) {
  return <div className="scope-grid"><article className="scope-card include"><Check size={21} /><h3>Dans le périmètre</h3><p>Ce qui sera réellement testé, avec quel public et quelles données autorisées.</p><Field area label="Usage inclus" value={form.included} onChange={(value) => update("included", value)} placeholder="Ex. génération d’un brouillon à partir d’une fiche de poste validée." /></article><article className="scope-card exclude"><Trash2 size={21} /><h3>Hors périmètre</h3><p>Ce qui est exclu, différé ou requiert une validation préalable.</p><Field area label="Usage exclu" value={form.excluded} onChange={(value) => update("excluded", value)} placeholder="Ex. tri automatique de CV, décision de recrutement, données de santé." /></article><article className="validator-card"><UsersRound size={21} /><div><h3>Qui garde la main ?</h3><p>Identifiez le responsable humain de validation.</p></div><Field label="Responsable humain" value={form.validator} onChange={(value) => update("validator", value)} placeholder="Ex. responsable recrutement" /></article></div>;
}

function Objective({ form, update, readiness }) {
  return <div><div className="objective-card"><Target size={21} /><div><h3>Formulez un objectif à la fois stratégique et vérifiable.</h3><p>Décrivez le résultat recherché, une valeur de départ, une cible, un horizon et une personne responsable.</p></div></div><div className="carto-grid two"><Field area label="Objectif mesurable" value={form.objective} onChange={(value) => update("objective", value)} placeholder="Ex. réduire de 25 % le temps consacré au premier brouillon, sans dégrader la qualité." /><Field label="Baseline actuelle" value={form.baseline} onChange={(value) => update("baseline", value)} placeholder="Ex. 40 minutes par offre" /><Field label="Cible" value={form.target} onChange={(value) => update("target", value)} placeholder="Ex. 30 minutes par offre" /><Field label="Horizon" value={form.horizon} onChange={(value) => update("horizon", value)} placeholder="Ex. sur 4 semaines de pilote" /></div><div className="ready-card"><BadgeCheck size={19} /><div><b>Votre indice actuel : {readiness}/15</b><p>Cette donnée ne décide pas à votre place : elle vous aide à expliciter le choix de poursuivre, ajuster ou différer.</p></div></div></div>;
}

function PrintSummary({ form, scores, readiness }) {
  return <section className="print-summary"><h1>Fiche C1 — Périmètre, opportunités, risques et objectif</h1><p><b>Organisation :</b> {form.organisation || "Non renseigné"} · <b>Rôle :</b> {form.role || "Non renseigné"}</p><h2>1. Processus examinés</h2><p><b>{form.processA || "Processus 1"}</b> — {form.taskA || "Non renseigné"}<br />Données : {form.dataA || "Non renseigné"}</p><p><b>{form.processB || "Processus 2"}</b> — {form.taskB || "Non renseigné"}<br />Données : {form.dataB || "Non renseigné"}</p><h2>2. Opportunités et risques</h2><p>Opportunités : {form.opportunityA || "—"} ; {form.opportunityB || "—"}</p><p>Risque éthique/juridique : {form.legalRisk || "—"}<br />Risque relationnel : {form.relationalRisk || "—"}<br />Prévention : {form.prevention || "—"}</p><h2>3. Périmètre et décision humaine</h2><p>Inclus : {form.included || "—"}<br />Exclu : {form.excluded || "—"}<br />Responsable humain : {form.validator || "—"}</p><h2>4. Objectif et baseline</h2><p>Objectif : {form.objective || "—"}<br />Baseline : {form.baseline || "—"} · Cible : {form.target || "—"} · Horizon : {form.horizon || "—"}</p><p><b>Indice d’opportunité :</b> {readiness}/15 (bénéfice {scores.benefit}, faisabilité {scores.feasibility}, risque {scores.risk}, acceptabilité {scores.acceptance})</p></section>;
}
