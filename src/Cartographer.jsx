/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, BriefcaseBusiness, Check, CircleCheck,
  FileText, Lightbulb, MapPinned, Plus, Save, ShieldCheck, Sparkles,
  Trash2, UsersRound,
} from "lucide-react";
import { opportunitySentence, processName, processOpportunity, useJ1Project } from "./j1Project";

const STEPS = [
  ["Contexte", BriefcaseBusiness, "Ancrez le travail dans une situation professionnelle, sans exposer de données réelles."],
  ["Processus 1", MapPinned, "Déroulez le premier processus en 4 à 7 étapes observables."],
  ["Processus 2", MapPinned, "Décrivez un second processus comparable afin de ne pas retenir la première intuition."],
  ["Opportunités", Lightbulb, "Formulez une assistance IA utile pour chacun des deux processus — jamais une décision automatisée."],
  ["Deux cartes", FileText, "Vérifiez que vos deux cartes sont comparables avant de passer à l’arbitrage."],
];

function Field({ label, hint, value, onChange, placeholder, area = false }) {
  const Input = area ? "textarea" : "input";
  return <label className="carto-field"><span>{label}{hint && <small>{hint}</small>}</span><Input value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function ProcessEditor({ index, process, updateProcess }) {
  const change = (field, value) => updateProcess({ ...process, [field]: value });
  const changeStep = (stepIndex, field, value) => {
    const steps = process.steps.map((step, itemIndex) => itemIndex === stepIndex ? { ...step, [field]: value } : step);
    updateProcess({ ...process, steps });
  };
  const addStep = () => {
    if (process.steps.length >= 7) return;
    updateProcess({ ...process, steps: [...process.steps, { task: "", data: "", people: "", irritant: "", humanControl: "", trace: "" }] });
  };
  const removeStep = (stepIndex) => {
    if (process.steps.length <= 4) return;
    updateProcess({ ...process, steps: process.steps.filter((_, itemIndex) => itemIndex !== stepIndex) });
  };
  return <div className="carto-process-editor">
    <div className="carto-grid two"><Field label="Nom du processus" value={process.title} onChange={(value) => change("title", value)} placeholder={index === 0 ? "Ex. Préparer et publier une offre" : "Ex. Préparer l’intégration d’un nouvel arrivant"} /><Field label="Déclencheur" hint="À quel moment commence-t-il ?" value={process.trigger} onChange={(value) => change("trigger", value)} placeholder="Ex. un besoin validé par le manager" /><Field area label="Finalité du processus" value={process.purpose} onChange={(value) => change("purpose", value)} placeholder="Ex. disposer d’une offre claire, inclusive et validée" /></div>
    <div className="carto-process-head"><div><p>CHAÎNE RÉELLE DU PROCESSUS</p><h3>{process.steps.length} étapes visibles <small>— minimum 4, maximum 7</small></h3></div><button className="carto-add-step" type="button" disabled={process.steps.length >= 7} onClick={addStep}><Plus size={15} /> Ajouter une étape</button></div>
    <div className="carto-step-list">{process.steps.map((item, stepIndex) => <article className="carto-process-step" key={`${index}-${stepIndex}`}>
      <div className="carto-step-number">{String(stepIndex + 1).padStart(2, "0")}</div>
      <div className="carto-step-fields">
        <Field label="Tâche réalisée" value={item.task} onChange={(value) => changeStep(stepIndex, "task", value)} placeholder="Ex. recueillir les éléments du besoin" />
        <Field label="Données / entrée" value={item.data} onChange={(value) => changeStep(stepIndex, "data", value)} placeholder="Ex. trame validée, référentiel métier" />
        <Field label="Personne(s) impliquée(s)" value={item.people} onChange={(value) => changeStep(stepIndex, "people", value)} placeholder="Ex. manager, recruteur·se" />
        <Field label="Irritant ou point de vigilance" value={item.irritant} onChange={(value) => changeStep(stepIndex, "irritant", value)} placeholder="Ex. informations incomplètes" />
        <Field label="Décision / contrôle humain (H)" value={item.humanControl} onChange={(value) => changeStep(stepIndex, "humanControl", value)} placeholder="Ex. validation du manager" />
        <Field label="Trace attendue" value={item.trace} onChange={(value) => changeStep(stepIndex, "trace", value)} placeholder="Ex. version relue et datée" />
      </div>
      {process.steps.length > 4 && <button type="button" className="carto-remove-step" aria-label="Retirer cette étape" onClick={() => removeStep(stepIndex)}><Trash2 size={15} /></button>}
    </article>)}</div>
  </div>;
}

function OpportunityEditor({ project, setProject }) {
  const update = (index, field, value) => setProject((current) => ({ ...current, processes: current.processes.map((process, processIndex) => {
    if (processIndex !== index) return process;
    const opportunityDetails = { ...(process.opportunityDetails || {}), [field]: value };
    return { ...process, opportunityDetails, opportunity: opportunitySentence(opportunityDetails) };
  }) }));
  return <div className="carto-opportunities">{project.processes.map((process, index) => {
    const details = process.opportunityDetails || {};
    const sentence = opportunitySentence(details);
    return <article className={`carto-opportunity-card ${index === 0 ? "blue" : "coral"}`} key={index}><div><span>{String(index + 1).padStart(2, "0")}</span><p>Fiche d’opportunité · {processName(project, index)}</p></div><div className="carto-opportunity-fields"><Field label="Action IA précise" hint="Un brouillon, une structuration, une reformulation ou un signalement ; jamais une décision sur une personne." value={details.action} onChange={(value) => update(index, "action", value)} placeholder="Ex. rédiger un premier brouillon d’offre" /><Field label="Bénéficiaire identifié" value={details.beneficiary} onChange={(value) => update(index, "beneficiary", value)} placeholder="Ex. recruteur·se et manager recruteur" /><Field label="Gain attendu" value={details.gain} onChange={(value) => update(index, "gain", value)} placeholder="Ex. réduire les aller-retours et homogénéiser les brouillons" /><Field label="Limite ou risque à respecter" value={details.limit} onChange={(value) => update(index, "limit", value)} placeholder="Ex. aucune donnée candidat ; risque de formulation stéréotypée" /><Field label="Point de contrôle humain" value={details.control} onChange={(value) => update(index, "control", value)} placeholder="Ex. relecture et validation RH/manager avant diffusion" /></div><div className="carto-opportunity-sentence"><b>Formulation enregistrée</b><p>« {sentence} »</p>{details.limit && <small><ShieldCheck size={13} /> Limite / risque : {details.limit}</small>}</div></article>;
  })}</div>;
}

function LiveSummary({ project }) {
  return <aside className="carto-live carto-live-new"><div className="live-label"><span /> BROUILLON EN DIRECT</div><h3>{project.context.organisation || "Votre organisation"}</h3><p>{project.context.irritant || "L’irritant principal apparaîtra ici."}</p><div className="live-section"><b><MapPinned size={15} /> Deux processus</b>{project.processes.map((process, index) => <span key={index}>{process.title || `Processus n°${index + 1}`}<small>{process.steps.filter((item) => item.task).length}/{process.steps.length} étapes décrites</small></span>)}</div><div className="live-section"><b><Lightbulb size={15} /> Deux opportunités</b>{project.processes.map((process, index) => <span key={index}>{process.opportunity || `Opportunité n°${index + 1}`} </span>)}</div><div className="live-human"><UsersRound size={16} /><span>Suite du parcours<br /><b>Arbitrage, données, fiche C1</b></span></div></aside>;
}

function PrintSummary({ project }) {
  return <section className="print-summary"><h1>Brouillon C1 — sortie du Cartographe</h1><p><b>Organisation :</b> {project.context.organisation || "Non renseigné"} · <b>Rôle :</b> {project.context.role || "Non renseigné"}</p><p><b>Irritant observé :</b> {project.context.irritant || "Non renseigné"}</p>{project.processes.map((process, index) => <div key={index}><h2>Processus {index + 1} — {process.title || "Non renseigné"}</h2><p><b>Déclencheur :</b> {process.trigger || "—"}<br /><b>Finalité :</b> {process.purpose || "—"}</p><h3>Fiche d’opportunité</h3><p><b>Action IA :</b> {process.opportunityDetails?.action || "—"}<br /><b>Bénéficiaire :</b> {process.opportunityDetails?.beneficiary || "—"}<br /><b>Gain attendu :</b> {process.opportunityDetails?.gain || "—"}<br /><b>Limite ou risque :</b> {process.opportunityDetails?.limit || "—"}<br /><b>Contrôle humain :</b> {process.opportunityDetails?.control || "—"}<br /><b>Formulation :</b> {process.opportunity || "—"}</p><ol>{process.steps.map((item, stepIndex) => <li key={stepIndex}><b>{item.task || `Étape ${stepIndex + 1}`}</b> — Données : {item.data || "—"}; personnes : {item.people || "—"}; H : {item.humanControl || "—"}; trace : {item.trace || "—"}.</li>)}</ol></div>)}</section>;
}

export function Cartographer({ back }) {
  const [project, setProject] = useJ1Project();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const filled = useMemo(() => project.processes.reduce((count, process) => count + process.steps.filter((item) => item.task).length, 0), [project]);
  const updateContext = (field, value) => setProject((current) => ({ ...current, context: { ...current.context, [field]: value } }));
  const updateProcess = (index, next) => setProject((current) => ({ ...current, processes: current.processes.map((process, processIndex) => processIndex === index ? next : process) }));

  return <main className="carto-shell">
    <header className="carto-topbar"><button className="carto-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 1</button><div className="carto-brand"><span><MapPinned size={18} /></span> Cartographe des opportunités RH</div><div className="carto-save"><Save size={15} /> Sauvegarde locale</div></header>
    <section className="carto-hero"><div className="carto-hero-photo" role="img" aria-label="Professionnelle RH analysant une cartographie de processus" /><div className="carto-hero-content"><p className="carto-eyebrow">JOUR 1 · OBSERVER AVANT DE CHOISIR</p><h1>Cartographier <span>deux processus RH.</span></h1><p>Rendez visibles les étapes, irritants, données, acteurs et décisions humaines, puis formulez une opportunité d’assistance IA pour chacun.</p><div className="carto-pills"><span><ShieldCheck size={15} /> Données fictives ou autorisées</span><span><BadgeCheck size={15} /> 20–25 minutes</span><span><FileText size={15} /> Deux cartes comparables</span></div></div></section>
    <section className="carto-layout carto-layout-new"><aside className="carto-side"><p>VOTRE PROGRESSION</p>{STEPS.map(([label, Icon], index) => <button className={index === step ? "active" : index < step ? "done" : ""} onClick={() => setStep(index)} key={label}><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{String(index + 1).padStart(2, "0")}</b>{label}</button>)}<div className="carto-side-note"><Sparkles size={16} /><p><b>{filled} étapes documentées</b><br />sur les deux cartes.</p></div></aside>
      <section className="carto-workspace"><div className="carto-step-heading"><span>ÉTAPE {step + 1} / {STEPS.length}</span><div><h2>{STEPS[step][0]}</h2><p>{STEPS[step][2]}</p></div></div>
        {step === 0 && <div className="carto-grid two"><Field label="Organisation ou contexte" value={project.context.organisation} onChange={(value) => updateContext("organisation", value)} placeholder="Ex. PME de 180 salariés, secteur services" /><Field label="Votre rôle dans ce processus" value={project.context.role} onChange={(value) => updateContext("role", value)} placeholder="Ex. responsable RH, recruteur·se" /><Field area label="Irritant observable" hint="Décrivez le problème ; ne cherchez pas encore de solution." value={project.context.irritant} onChange={(value) => updateContext("irritant", value)} placeholder="Ex. les premières versions d’offres sont hétérogènes et demandent plusieurs aller-retours." /></div>}
        {step === 1 && <ProcessEditor index={0} process={project.processes[0]} updateProcess={(next) => updateProcess(0, next)} />}
        {step === 2 && <ProcessEditor index={1} process={project.processes[1]} updateProcess={(next) => updateProcess(1, next)} />}
        {step === 3 && <OpportunityEditor project={project} setProject={setProject} />}
        {step === 4 && <div className="carto-recap"><div className="carto-recap-banner"><CircleCheck size={22} /><div><h3>Vos deux cartes sont prêtes à être comparées.</h3><p>Le Cartographe ne choisit pas à votre place : l’étape suivante est la matrice d’arbitrage, qui mettra les deux opportunités en discussion.</p></div></div>{project.processes.map((process, index) => <article className="carto-recap-card" key={index}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{processName(project, index)}</h3><p><b>Opportunité :</b> {processOpportunity(project, index)}</p><p><b>Décision humaine :</b> {process.steps.map((item) => item.humanControl).filter(Boolean).join(" · ") || "à rendre visible"}</p></div></article>)}</div>}
        <div className="carto-actions"><button className="carto-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Précédent</button>{step < STEPS.length - 1 ? <button className="carto-primary" onClick={() => setStep((current) => current + 1)}>Continuer <ArrowRight size={17} /></button> : <button className="carto-primary" onClick={() => { setSaved(true); window.print(); }}><FileText size={17} /> Exporter le brouillon</button>}</div>{saved && <p className="carto-saved"><CircleCheck size={17} /> Votre brouillon est prêt. Dans la fenêtre d’impression, choisissez « Enregistrer au format PDF ».</p>}</section><LiveSummary project={project} /></section><PrintSummary project={project} />
  </main>;
}
