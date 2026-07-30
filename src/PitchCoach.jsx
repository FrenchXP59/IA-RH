/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, CheckCircle2, ClipboardCheck,
  Download, Lightbulb, Mic, Pause, Play, RotateCcw, Save, ShieldCheck,
  Sparkles, Target, Timer,
} from "lucide-react";

const steps = [["Problème", Target], ["Choix", Sparkles], ["Garde-fous", ShieldCheck], ["Preuves", ClipboardCheck], ["Soutenir", Mic]];
const defaultForm = { audience: "Sponsor ou comité de pilotage", project: "", problem: "", impact: "", solution: "", choiceReason: "", safeguards: "", humanRole: "", tests: "", metrics: "", limit: "", nextDecision: "" };
const descriptions = [
  "Commencez par le problème métier observable. Ne partez ni de l’outil, ni d’une promesse de performance impossible à prouver.",
  "Expliquez le choix de l’usage IA : une assistance précise, dans un périmètre défini, avec une valeur attendue réaliste.",
  "Une soutenance crédible explicite les risques, le contrôle humain et ce qui ne fait pas partie du projet.",
  "Distinguez les résultats pédagogiques, les résultats de test et les preuves réelles. Reliez-les à vos indicateurs de mesure.",
  "Votre trame est prête. Lancez le chronomètre, parlez naturellement, puis ajustez jusqu’à ce que chaque affirmation soit juste et défendable.",
];

export function PitchCoach({ back }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    try { return { ...defaultForm, ...JSON.parse(localStorage.getItem("ia-rh-pitch-coach") || "{}").form }; }
    catch { return defaultForm; }
  });
  const [seconds, setSeconds] = useState(90);
  const [running, setRunning] = useState(false);
  const [exported, setExported] = useState(false);
  useEffect(() => localStorage.setItem("ia-rh-pitch-coach", JSON.stringify({ form })), [form]);
  useEffect(() => {
    if (!running || seconds === 0) return undefined;
    const id = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running, seconds]);
  useEffect(() => { if (seconds === 0) setRunning(false); }, [seconds]);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const script = useMemo(() => buildPitch(form), [form]);
  const words = countWords(script);
  const completeness = [form.project, form.problem, form.solution, form.safeguards, form.tests, form.metrics, form.nextDecision].filter(Boolean).length;
  const resetTimer = () => { setRunning(false); setSeconds(90); };
  const restartTimer = () => { setRunning(false); setSeconds(90); window.setTimeout(() => setRunning(true), 0); };

  return <main className="pitch-shell">
    <header className="pitch-topbar"><button className="pitch-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 3</button><div className="pitch-brand"><span><Mic size={17} /></span> Coach de pitch</div><div className="pitch-save"><Save size={15} /> Sauvegarde locale</div></header>
    <section className="pitch-hero"><div className="pitch-hero-image" role="img" aria-label="Professionnelle présentant une feuille de route de projet IA et RH à son équipe" /><div className="pitch-hero-content"><p className="pitch-eyebrow">JOUR 3 · COACH DE SOUTENANCE</p><h1>Raconter un projet<br /><span>qui tient debout.</span></h1><p>Préparez un pitch de 90 secondes fondé sur un problème réel, des preuves, des garde-fous et la prochaine décision humaine.</p><div className="pitch-pills"><span><ShieldCheck size={15} /> Limites assumées</span><span><BadgeCheck size={15} /> Trame de 90 secondes</span></div></div></section>
    <section className="pitch-layout">
      <aside className="pitch-stepper"><p>VOTRE PITCH</p>{steps.map(([label, Icon], index) => <button className={index === step ? "active" : index < step ? "done" : ""} onClick={() => setStep(index)} key={label}><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{String(index + 1).padStart(2, "0")}</b>{label}</button>)}<div className="pitch-mini"><Sparkles size={16} /><p><b>{completeness} idées solides</b> sur les 7 repères du pitch.</p></div></aside>
      <section className="pitch-workspace"><div className="pitch-step-heading"><span>ÉTAPE {step + 1} / 5</span><div><h2>{steps[step][0]}</h2><p>{descriptions[step]}</p></div></div>
        {step === 0 && <Problem form={form} update={update} />}
        {step === 1 && <Choice form={form} update={update} />}
        {step === 2 && <Safeguards form={form} update={update} />}
        {step === 3 && <Evidence form={form} update={update} />}
        {step === 4 && <Rehearse form={form} update={update} script={script} words={words} seconds={seconds} running={running} setRunning={setRunning} reset={resetTimer} restart={restartTimer} />}
        <div className="pitch-actions"><button className="pitch-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Précédent</button>{step < 4 ? <button className="pitch-primary" onClick={() => setStep((current) => current + 1)}>Continuer <ArrowRight size={17} /></button> : <button className="pitch-primary" onClick={() => { setExported(true); window.print(); }}><Download size={17} /> Exporter mon pitch</button>}</div>{exported && <p className="pitch-exported"><CheckCircle2 size={17} /> Votre trame est prête. Dans la fenêtre d’impression, choisissez « Enregistrer au format PDF ».</p>}
      </section>
      <aside className="pitch-live"><div className="pitch-live-image" /><div className="pitch-live-body"><div className="pitch-live-label"><span /> VOTRE FIL ROUGE</div><h3>{form.project || "Votre projet IA & RH"}</h3><p>{form.problem || "Le problème réel à résoudre apparaîtra ici."}</p><div className="pitch-live-row"><b>Audience</b><span>{form.audience}</span></div><div className="pitch-live-row"><b>Prochaine décision</b><span>{form.nextDecision || "À préciser"}</span></div><div className="pitch-live-time"><span>Durée estimée</span><b>{estimatedTime(words)}</b><small>{words} mots</small></div><div className="pitch-human"><ShieldCheck size={16} /><span>Un pitch crédible<br /><b>assume ses limites</b></span></div></div></aside>
    </section>
    <PrintSummary form={form} script={script} />
  </main>;
}

function Field({ label, hint, value, onChange, placeholder, area = false }) {
  const Input = area ? "textarea" : "input";
  return <label className="pitch-field"><span>{label}{hint && <small>{hint}</small>}</span><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function Chips({ title, choices, value, change }) { return <div className="pitch-chips"><b>{title}</b><div>{choices.map((choice) => <button className={choice === value ? "selected" : ""} onClick={() => change(choice)} type="button" key={choice}>{choice}</button>)}</div></div>; }
function Problem({ form, update }) { return <div className="pitch-grid"><Chips title="À qui vous vous adressez" choices={["Sponsor ou comité de pilotage", "Direction RH", "Équipe RH et managers"]} value={form.audience} change={(value) => update("audience", value)} /><Field label="Nom court du projet" value={form.project} onChange={(value) => update("project", value)} placeholder="Ex. pilote de rédaction assistée des offres" /><Field area label="Problème réel" hint="Fait observable, pas solution technique." value={form.problem} onChange={(value) => update("problem", value)} placeholder="Ex. la production des offres prend du temps, varie selon les rédacteurs et entraîne des retouches fréquentes." /><Field area label="Impact pour l’activité et les personnes" value={form.impact} onChange={(value) => update("impact", value)} placeholder="Ex. les recruteurs disposent de moins de temps pour l’échange avec les managers et les candidats." /></div>; }
function Choice({ form, update }) { return <div className="pitch-grid"><div className="pitch-callout"><Lightbulb size={20} /><div><b>Expliquez le « pourquoi » avant le « comment ».</b><p>Votre projet est une réponse proportionnée à un besoin ; l’outil reste un moyen conditionnel, jamais le point de départ.</p></div></div><Field area label="Usage IA retenu" value={form.solution} onChange={(value) => update("solution", value)} placeholder="Ex. générer un premier brouillon structuré à partir d’une fiche de poste validée, puis le faire relire par les RH." /><Field area label="Pourquoi ce choix ?" value={form.choiceReason} onChange={(value) => update("choiceReason", value)} placeholder="Ex. l’usage reste centré sur la rédaction, limité à des sources autorisées et ne prend aucune décision concernant un candidat." /></div>; }
function Safeguards({ form, update }) { return <div className="pitch-grid"><div className="pitch-callout violet"><ShieldCheck size={20} /><div><b>Les garde-fous font partie de la valeur du projet.</b><p>Les présenter montre que vous savez ce qui doit être contrôlé avant toute diffusion ou généralisation.</p></div></div><Field area label="Risques et garde-fous" value={form.safeguards} onChange={(value) => update("safeguards", value)} placeholder="Ex. données fictives ou autorisées ; contrôle des formulations inclusives ; informations non vérifiées signalées ; règle d’arrêt documentée." /><Field area label="Rôle humain non délégable" value={form.humanRole} onChange={(value) => update("humanRole", value)} placeholder="Ex. le recruteur valide le brouillon et garde la décision de publication ; aucun tri de CV n’est automatisé." /></div>; }
function Evidence({ form, update }) { return <div className="pitch-grid"><div className="pitch-callout blue"><ClipboardCheck size={20} /><div><b>Une preuve est précise, datée et contextualisée.</b><p>Ne transformez jamais un exercice Novalys en résultat réel. Distinguez ce qui a été testé, ce qui reste à confirmer et qui le vérifiera.</p></div></div><Field area label="Tests ou apprentissages observés" value={form.tests} onChange={(value) => update("tests", value)} placeholder="Ex. test sur cinq fiches de poste fictives ; les écarts de ton ont été repérés par le prompt de contrôle puis corrigés." /><Field area label="Indicateurs à suivre" value={form.metrics} onChange={(value) => update("metrics", value)} placeholder="Ex. temps de préparation, taux de retouches, incidents de qualité et retours des recruteurs/managers." /><Field area label="Limite assumée" value={form.limit} onChange={(value) => update("limit", value)} placeholder="Ex. le pilote ne permet pas encore de conclure à un gain durable ; une revue après quatre semaines reste nécessaire." /></div>; }

function Rehearse({ form, update, script, words, seconds, running, setRunning, reset, restart }) {
  const targetClass = words < 135 ? "short" : words > 235 ? "long" : "good";
  const width = `${Math.min(100, (words / 200) * 100)}%`;
  const toggleTimer = () => { if (seconds === 0) restart(); else setRunning((current) => !current); };
  return <div className="pitch-rehearse">
    <div className={`pitch-word-meter ${targetClass}`}><div><span>VOLUME DU PITCH</span><b>{words} <small>mots</small></b><p>{words < 135 ? "Votre pitch est très court : ajoutez une preuve ou une décision suivante." : words > 235 ? "Votre pitch risque de dépasser 90 secondes : privilégiez l’essentiel." : "Le volume est adapté à une prise de parole d’environ 90 secondes."}</p></div><i><b style={{ width }} /></i></div>
    <article className="pitch-script"><div><span>TRAME À PRONONCER</span><button onClick={() => navigator.clipboard?.writeText(script)}>Copier</button></div><p>{script}</p></article>
    <div className="pitch-timer"><Timer size={22} /><div><span>RÉPÉTITION</span><b>{formatTime(seconds)}</b></div></div>
    <div className="pitch-timer-actions"><button className="pitch-play" onClick={toggleTimer}>{running ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}{running ? "Pause" : seconds === 0 ? "Recommencer" : "Lancer 90 s"}</button><button onClick={reset}><RotateCcw size={16} /> Réinitialiser</button></div>
    <Field area label="Prochaine décision humaine à demander" value={form.nextDecision} onChange={(value) => update("nextDecision", value)} placeholder="Ex. valider le lancement d’un pilote de quatre semaines, avec revue des trois indicateurs et règle d’arrêt." />
  </div>;
}

function buildPitch(form) { return `Bonjour. Je vous propose ${form.project || "un pilote IA & RH"}.\n\nLe point de départ est le suivant : ${form.problem || "[décrire le problème métier observable]"}${form.impact ? ` Cela a un impact : ${form.impact}` : ""}\n\nNous retenons ${form.solution || "[décrire l’usage IA retenu]"}.${form.choiceReason ? ` Ce choix est pertinent car ${form.choiceReason}` : ""}\n\nLe projet reste encadré : ${form.safeguards || "[préciser les garde-fous]"}.${form.humanRole ? ` La décision humaine reste entre les mains de ${form.humanRole}` : ""}\n\nLes premières preuves ou tests sont les suivants : ${form.tests || "[décrire les tests réalisés ou à réaliser]"}. Nous suivrons ${form.metrics || "[indiquer les indicateurs d’efficacité, de qualité et de relation humaine]"}.${form.limit ? ` Notre limite actuelle est claire : ${form.limit}` : ""}\n\nLa décision que nous vous demandons aujourd’hui est de ${form.nextDecision || "[formuler la prochaine décision humaine]"}. Merci.`; }
function countWords(text) { return text.replace(/\[[^\]]+\]/g, "").trim().split(/\s+/).filter(Boolean).length; }
function estimatedTime(words) { return `${Math.max(0, Math.round((words / 150) * 60))} s`; }
function formatTime(seconds) { return `0:${String(seconds).padStart(2, "0")}`; }
function PrintSummary({ form, script }) { return <section className="pitch-print-summary"><h1>Coach de pitch — Trame de soutenance J3</h1><h2>Pitch</h2><p>{script}</p><h2>Repères</h2><p><b>Audience :</b> {form.audience}<br /><b>Garde-fous :</b> {form.safeguards || "À préciser"}<br /><b>Indicateurs :</b> {form.metrics || "À préciser"}<br /><b>Décision demandée :</b> {form.nextDecision || "À préciser"}</p></section>; }
