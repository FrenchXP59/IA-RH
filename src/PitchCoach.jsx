import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, CheckCircle2, ChevronDown,
  ChevronUp, Copy, Download, FileCheck2, Info, MessageCircleQuestion,
  Mic, Pause, Play, RefreshCw, RotateCcw, Save, ShieldCheck, Sparkles, Timer,
} from "lucide-react";
import { loadJ1Project, processName, processOpportunity } from "./j1Project";
import "./PitchCoach.css";

const STORAGE_KEY = "ia-rh-pitch-coach-v2";
const LEGACY_KEY = "ia-rh-pitch-coach";
const FINAL_STUDIO_KEY = "ia-rh-final-certification-studio";
const J2_STORAGE_KEY = "ia-rh-j2-certification-studio";
const TIMER_SECONDS = 300;
const MAX_PITCH_WORDS = 520;
const MIN_PITCH_WORDS = 390;

const STEPS = [
  ["Reprendre", RefreshCw],
  ["Personnaliser", Sparkles],
  ["S’entraîner", Mic],
];

const QUESTIONS = [
  ["choice", "Pourquoi avoir choisi ce processus plutôt qu’un autre ?"],
  ["human", "Quelle décision reste obligatoirement humaine ?"],
  ["data", "Quelles données sont autorisées et lesquelles sont exclues ?"],
  ["test", "Quel test vous a conduit à ajuster ou sécuriser le projet ?"],
  ["relation", "Comment mesurez-vous les effets sur la relation humaine ?"],
  ["stop", "Dans quelle situation suspendriez-vous le pilote ?"],
];

const defaultPersonal = {
  audience: "Jury de certification",
  opening: "",
  keyIdea: "",
  limit: "",
  requestedDecision: "",
  script: "",
  answers: Object.fromEntries(QUESTIONS.map(([key]) => [key, ""])),
};

function parseStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function buildFallbackSource() {
  const j1 = loadJ1Project();
  const j2 = parseStorage(J2_STORAGE_KEY);
  const retained = ["0", "1"].includes(j1.arbitration?.retained)
    ? Number(j1.arbitration.retained)
    : null;

  return {
    importedAt: new Date().toISOString(),
    project: j2.process || (retained !== null ? processName(j1, retained) : ""),
    context: j2.context || j1.context.organisation || "",
    problem: j2.problem || j1.context.irritant || "",
    objective: j2.objective || j1.c1.indicator || "",
    opportunity: retained !== null ? processOpportunity(j1, retained) : "",
    arbitration: j1.arbitration.rationale || "",
    solutions: [j2.solutionA?.name, j2.solutionB?.name].filter(Boolean),
    conditionalChoice: j2.conditionalChoice || "",
    promptV2: j2.promptV2 || "",
    controlPrompt: j2.controlPrompt || "",
    tests: { ...(j2.tests || {}) },
    risks: [
      [j1.c1.ethicalRisk1, j1.c1.ethicalPrevention1],
      [j1.c1.ethicalRisk2, j1.c1.ethicalPrevention2],
      [j1.c1.relationalRisk, j1.c1.relationalPrevention],
    ],
    allowedData: j2.authorizedData || j1.c1.allowedData || "",
    forbiddenData: j2.forbiddenData || "",
    perimeter: j2.perimeter || j1.c1.included || "",
    outOfScope: j2.outOfScope || j1.c1.excluded || "",
    humanDecision: j2.humanDecision || j1.c1.humanValidation || "",
    accessibility: j2.accessibilityRequirement || "",
    j2Decision: j2.decision || "",
    j2Limit: j2.identifiedLimit || "",
    adoption: {},
    measurement: {},
    finalDecision: {
      decision: "",
      rationale: "",
      nextAction: j2.nextAction || "",
      reviewDate: j2.reviewDate || "",
      stopRule: "",
    },
  };
}

function buildSource() {
  const finalStudio = parseStorage(FINAL_STUDIO_KEY);
  if (!finalStudio.snapshot?.c1) return buildFallbackSource();

  const { snapshot, j3 = {} } = finalStudio;
  return {
    importedAt: new Date().toISOString(),
    project: snapshot.c1.retainedProcess || "",
    context: snapshot.c1.organisation || "",
    problem: snapshot.c1.problem || "",
    objective: snapshot.c1.objective || "",
    opportunity: snapshot.c1.retainedOpportunity || "",
    arbitration: snapshot.c1.arbitration || "",
    solutions: [snapshot.c2.solutionA?.name, snapshot.c2.solutionB?.name].filter(Boolean),
    conditionalChoice: snapshot.c2.conditionalChoice || "",
    promptV2: snapshot.c3.promptV2 || "",
    controlPrompt: snapshot.c3.controlPrompt || "",
    tests: { ...(snapshot.c3.tests || {}) },
    risks: [...(snapshot.c1.risks || [])],
    allowedData: snapshot.c3.authorizedData || snapshot.c1.allowedData || "",
    forbiddenData: snapshot.c3.forbiddenData || "",
    perimeter: snapshot.c1.perimeter || "",
    outOfScope: snapshot.c1.outOfScope || "",
    humanDecision: snapshot.c1.humanDecision || "",
    accessibility: snapshot.c3.accessibilityRequirement || "",
    j2Decision: snapshot.c3.j2Decision || "",
    j2Limit: snapshot.c3.identifiedLimit || "",
    adoption: {
      audiences: j3.audiences || "",
      keyMessage: j3.keyMessage || "",
      diffusionActions: j3.diffusionActions || "",
      trainingAndSupport: j3.trainingAndSupport || "",
      charterAndSobriety: j3.charterAndSobriety || "",
    },
    measurement: {
      efficiencyBefore: j3.efficiencyBefore || "",
      efficiencyAfter: j3.efficiencyAfter || "",
      qualityBefore: j3.qualityBefore || "",
      qualityAfter: j3.qualityAfter || "",
      humanBefore: j3.humanBefore || "",
      humanAfter: j3.humanAfter || "",
      collectionPlan: j3.collectionPlan || "",
      userFeedback: j3.userFeedback || "",
    },
    finalDecision: {
      decision: j3.decision || "",
      rationale: j3.decisionRationale || "",
      nextAction: j3.nextAction || "",
      reviewDate: j3.reviewDate || "",
      stopRule: j3.stopRule || "",
    },
  };
}

function loadCoach() {
  const saved = parseStorage(STORAGE_KEY);
  const source = saved.source?.project !== undefined ? saved.source : buildSource();
  const legacy = parseStorage(LEGACY_KEY).form || {};
  const personal = {
    ...defaultPersonal,
    audience: saved.personal?.audience || legacy.audience || defaultPersonal.audience,
    opening: saved.personal?.opening || "",
    keyIdea: saved.personal?.keyIdea || legacy.solution || "",
    limit: saved.personal?.limit || legacy.limit || source.j2Limit || "",
    requestedDecision: saved.personal?.requestedDecision || legacy.nextDecision || source.finalDecision.nextAction || "",
    script: saved.personal?.script || "",
    answers: { ...defaultPersonal.answers, ...(saved.personal?.answers || {}) },
  };
  if (!personal.script || countWords(personal.script) > MAX_PITCH_WORDS) personal.script = buildPitch(source, personal);
  return { source, personal };
}

export function PitchCoach({ back }) {
  const [step, setStep] = useState(0);
  const [coach, setCoach] = useState(loadCoach);
  const [seconds, setSeconds] = useState(TIMER_SECONDS);
  const [running, setRunning] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coach));
  }, [coach]);

  useEffect(() => {
    if (!running || seconds === 0) return undefined;
    const id = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(id);
  }, [running, seconds]);

  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);

  const update = (field, value) => setCoach((current) => ({
    ...current,
    personal: { ...current.personal, [field]: value },
  }));

  const updateAnswer = (key, value) => setCoach((current) => ({
    ...current,
    personal: {
      ...current.personal,
      answers: { ...current.personal.answers, [key]: value },
    },
  }));

  const rebuildScript = (newSource = coach.source) => setCoach((current) => {
    const personal = { ...current.personal };
    return { source: newSource, personal: { ...personal, script: buildPitch(newSource, personal) } };
  });

  const refreshSource = () => rebuildScript(buildSource());
  const script = coach.personal.script;
  const words = useMemo(() => countWords(script), [script]);
  const sourceCount = useMemo(() => countSource(coach.source), [coach.source]);
  const elapsed = TIMER_SECONDS - seconds;

  const resetTimer = () => {
    setRunning(false);
    setSeconds(TIMER_SECONDS);
  };

  const toggleTimer = () => {
    if (seconds === 0) {
      setSeconds(TIMER_SECONDS);
      window.setTimeout(() => setRunning(true), 0);
    } else {
      setRunning((current) => !current);
    }
  };

  const copyScript = async () => {
    await navigator.clipboard?.writeText(script);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const exportDocument = () => {
    setExported(true);
    window.setTimeout(() => window.print(), 80);
  };

  return <main className="pitch-shell pitch-v2">
    <header className="pitch-topbar">
      <button className="pitch-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 3</button>
      <div className="pitch-brand"><span><Mic size={17} /></span> Coach Soutenance</div>
      <div className="pitch-save"><Save size={15} /> Sauvegarde locale</div>
    </header>

    <section className="pitch-hero">
      <div className="pitch-hero-image" role="img" aria-label="Professionnelle présentant son projet IA et RH à un jury" />
      <div className="pitch-hero-content">
        <p className="pitch-eyebrow">JOUR 3 · SOUTENANCE DE 5 MINUTES</p>
        <h1>Défendre le projet.<br /><span>Pas réciter le dossier.</span></h1>
        <p>Reprenez votre Studio final, personnalisez quatre messages et entraînez-vous avec des repères de temps simples.</p>
        <div className="pitch-pills">
          <span><RefreshCw size={15} /> Dossier repris</span>
          <span><Timer size={15} /> Chronomètre 5 min</span>
          <span><BadgeCheck size={15} /> Questions facultatives</span>
        </div>
      </div>
    </section>

    <section className="pitch-layout">
      <aside className="pitch-stepper">
        <p>VOTRE SOUTENANCE</p>
        {STEPS.map(([label, Icon], index) => <button
          type="button"
          className={index === step ? "active" : index < step ? "done" : ""}
          onClick={() => setStep(index)}
          key={label}
        ><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{String(index + 1).padStart(2, "0")}</b>{label}</button>)}
        <div className="pitch-mini"><Sparkles size={16} /><p><b>{sourceCount} repères repris</b><br />du Studio final.</p></div>
      </aside>

      <section className="pitch-workspace">
        <div className="pitch-step-heading">
          <span>ÉTAPE {step + 1} / 3</span>
          <div><h2>{STEPS[step][0]}</h2><p>{descriptions[step]}</p></div>
        </div>

        {step === 0 && <ResumeSource source={coach.source} sourceCount={sourceCount} refresh={refreshSource} />}
        {step === 1 && <Personalize personal={coach.personal} update={update} rebuild={() => rebuildScript()} />}
        {step === 2 && <Rehearse
          personal={coach.personal}
          update={update}
          updateAnswer={updateAnswer}
          words={words}
          seconds={seconds}
          elapsed={elapsed}
          running={running}
          toggleTimer={toggleTimer}
          resetTimer={resetTimer}
          showQuestions={showQuestions}
          setShowQuestions={setShowQuestions}
          copyScript={copyScript}
          copied={copied}
        />}

        <div className="pitch-actions">
          <button className="pitch-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Précédent</button>
          {step < 2
            ? <button className="pitch-primary" onClick={() => setStep((current) => current + 1)}>Continuer <ArrowRight size={17} /></button>
            : <button className="pitch-primary" onClick={exportDocument}><Download size={17} /> Exporter ma fiche orale</button>}
        </div>
        {exported && step === 2 && <p className="pitch-exported"><CheckCircle2 size={17} /> Dans la fenêtre d’impression, choisissez « Enregistrer au format PDF ».</p>}
      </section>

      <aside className="pitch-live">
        <div className="pitch-live-image" />
        <div className="pitch-live-body">
          <div className="pitch-live-label"><span /> VOTRE FIL ROUGE</div>
          <h3>{coach.source.project || "Votre projet IA & RH"}</h3>
          <p>{coach.personal.keyIdea || coach.source.objective || "L’idée à retenir apparaîtra ici."}</p>
          <div className="pitch-live-row"><b>Audience</b><span>{coach.personal.audience}</span></div>
          <div className="pitch-live-row"><b>Décision demandée</b><span>{coach.personal.requestedDecision || "À préciser"}</span></div>
          <div className="pitch-live-time"><span>Volume actuel</span><b>{estimatedTime(words)}</b><small>{words} mots · cible 5 min</small></div>
          <div className="pitch-human"><ShieldCheck size={16} /><span>Un pitch crédible<br /><b>assume une limite</b></span></div>
        </div>
      </aside>
    </section>

    <PrintSummary source={coach.source} personal={coach.personal} />
  </main>;
}

const descriptions = [
  "Le Coach retrouve le contenu du Studio final. Vérifiez le projet et actualisez seulement si vous avez modifié le dossier.",
  "Travaillez votre manière de présenter : une ouverture, une idée forte, une limite et la décision attendue. Le fond du dossier est déjà là.",
  "Adaptez la trame, lancez le chronomètre et utilisez les questions du jury uniquement si elles vous aident à vous préparer.",
];

function ResumeSource({ source, sourceCount, refresh }) {
  const observedTests = Object.values(source.tests || {}).filter((test) => test?.observed).length;
  const measurements = Object.values(source.measurement || {}).filter((value) => String(value || "").trim()).length;

  return <div className="pitch-resume">
    <div className="pitch-import-note">
      <FileCheck2 size={21} />
      <div><b>{sourceCount} repères ont été repris automatiquement.</b><p>Vous n’avez pas à recopier les prompts, les tests, les risques ou les indicateurs.</p></div>
    </div>
    <div className="pitch-resume-grid">
      <article>
        <span>01 · PROBLÈME</span>
        <h3>{source.project || "Processus à retrouver"}</h3>
        <p>{source.problem || "Le problème du projet n’a pas encore été retrouvé."}</p>
      </article>
      <article>
        <span>02 · CHOIX</span>
        <h3>{source.solutions.join(" · ") || "Solutions à retrouver"}</h3>
        <p>{source.conditionalChoice || source.opportunity || "Le choix conditionnel reste à retrouver."}</p>
      </article>
      <article>
        <span>03 · TESTS</span>
        <h3>{observedTests} / 5 tests renseignés</h3>
        <p>{source.j2Decision ? `Décision J2 : ${source.j2Decision}` : "La décision du J2 reste à retrouver."}</p>
      </article>
      <article>
        <span>04 · DÉPLOIEMENT</span>
        <h3>{source.finalDecision.decision || "Décision finale à préciser"}</h3>
        <p>{measurements ? `${measurements} éléments de mesure repris.` : "Les mesures du J3 restent à compléter."}</p>
      </article>
    </div>
    <button type="button" className="pitch-refresh" onClick={refresh}><RefreshCw size={16} /> Actualiser et reconstruire la trame</button>
    <p className="pitch-source-help"><Info size={16} /> Si certaines informations manquent, complétez d’abord le Studio final puis revenez sur ce bouton.</p>
  </div>;
}

function Field({ label, hint, value, onChange, placeholder, area = true }) {
  const Input = area ? "textarea" : "input";
  return <label className="pitch-field">
    <span>{label}{hint && <small>{hint}</small>}</span>
    <Input value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
  </label>;
}

function Personalize({ personal, update, rebuild }) {
  return <div className="pitch-personalize">
    <div className="pitch-callout">
      <Sparkles size={20} />
      <div><b>Quatre choix personnels, pas un nouveau dossier.</b><p>Ces éléments donnent une voix et une direction à votre soutenance.</p></div>
    </div>
    <label className="pitch-audience">
      <span>À qui vous vous adressez</span>
      <select value={personal.audience} onChange={(event) => update("audience", event.target.value)}>
        <option>Jury de certification</option>
        <option>Sponsor ou comité de pilotage</option>
        <option>Direction RH</option>
        <option>Équipe RH et managers</option>
      </select>
    </label>
    <div className="pitch-personal-grid">
      <Field label="Votre phrase d’ouverture" value={personal.opening} onChange={(value) => update("opening", value)} placeholder="Ex. Tout est parti d’un constat simple : nos entretiens produisent beaucoup d’informations, mais peu de suivi exploitable." />
      <Field label="L’idée principale à retenir" value={personal.keyIdea} onChange={(value) => update("keyIdea", value)} placeholder="Ex. l’IA structure un premier brouillon ; elle ne remplace ni l’analyse RH ni la décision du manager." />
      <Field label="La limite que vous assumez" value={personal.limit} onChange={(value) => update("limit", value)} placeholder="Ex. le pilote ne permet pas encore de conclure à un gain durable sur l’ensemble de l’organisation." />
      <Field label="La décision que vous demandez" value={personal.requestedDecision} onChange={(value) => update("requestedDecision", value)} placeholder="Ex. autoriser un pilote limité de quatre semaines, avec revue des indicateurs et règle d’arrêt." />
    </div>
    <button type="button" className="pitch-rebuild" onClick={rebuild}><RefreshCw size={16} /> Construire la trame avec ces éléments</button>
  </div>;
}

function Rehearse({
  personal, update, updateAnswer, words, seconds, elapsed, running,
  toggleTimer, resetTimer, showQuestions, setShowQuestions, copyScript, copied,
}) {
  const targetClass = words < MIN_PITCH_WORDS ? "short" : words >= MAX_PITCH_WORDS ? "long" : "good";
  const width = `${Math.min(100, (words / MAX_PITCH_WORDS) * 100)}%`;
  const milestones = [
    [0, 50, "Problème réel"],
    [50, 110, "Solution et conception"],
    [110, 170, "Tests et sécurisation"],
    [170, 230, "Déploiement et mesure"],
    [230, 300, "Limites et décision"],
  ];

  return <div className="pitch-rehearse">
    <div className={`pitch-word-meter ${targetClass}`}>
      <div>
        <span>VOLUME DE LA SOUTENANCE</span>
        <b>{words} <small>mots</small></b>
        <p>{words < MIN_PITCH_WORDS
          ? "La trame est encore courte pour cinq minutes : développez un exemple, un test ou votre méthode de mesure."
          : words >= MAX_PITCH_WORDS
            ? "La limite de 520 mots est atteinte : gardez l’essentiel et expliquez les détails seulement si le jury vous le demande."
            : "Le volume est cohérent avec une prise de parole d’environ cinq minutes."}</p>
      </div>
      <i><b style={{ width }} /></i>
    </div>

    <article className="pitch-script editable">
      <div><span>TRAME MODIFIABLE · 520 MOTS MAXIMUM</span><button type="button" onClick={copyScript}>{copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}{copied ? "Copiée" : "Copier"}</button></div>
      <textarea aria-label="Trame de soutenance modifiable" value={personal.script} onChange={(event) => update("script", limitPitchWords(event.target.value, MAX_PITCH_WORDS))} />
    </article>

    <div className="pitch-training-grid">
      <div className="pitch-clock-card">
        <div className="pitch-timer"><Timer size={24} /><div><span>RÉPÉTITION</span><b>{formatTime(seconds)}</b></div></div>
        <div className="pitch-timer-actions">
          <button type="button" className="pitch-play" onClick={toggleTimer}>{running ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}{running ? "Pause" : seconds === 0 ? "Recommencer" : "Lancer 5 min"}</button>
          <button type="button" onClick={resetTimer}><RotateCcw size={16} /> Réinitialiser</button>
        </div>
      </div>
      <div className="pitch-milestones">
        <p>REPÈRES DE TEMPS</p>
        {milestones.map(([start, end, label], index) => {
          const done = elapsed >= end;
          const active = elapsed >= start && elapsed < end;
          return <div className={done ? "done" : active && running ? "active" : ""} key={label}>
            <span>{done ? <Check size={13} /> : String(index + 1).padStart(2, "0")}</span>
            <b>{formatMinute(start)}–{formatMinute(end)}</b>
            <small>{label}</small>
          </div>;
        })}
      </div>
    </div>

    <section className="pitch-jury">
      <button type="button" onClick={() => setShowQuestions((current) => !current)}>
        <MessageCircleQuestion size={19} />
        <div><b>Questions possibles du jury</b><span>Facultatif · préparez seulement celles qui vous sont utiles</span></div>
        {showQuestions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {showQuestions && <div className="pitch-question-list">
        {QUESTIONS.map(([key, question], index) => <article key={key}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><b>{question}</b><textarea value={personal.answers[key]} onChange={(event) => updateAnswer(key, event.target.value)} placeholder="Votre réponse courte…" /></div>
        </article>)}
      </div>}
    </section>
  </div>;
}

function buildPitch(source, personal) {
  const tests = Object.entries(source.tests || {})
    .filter(([, test]) => test?.observed)
    .map(([key, test]) => `${testLabel(key)} : ${excerpt(test.observed, 20)}${test.adjustment ? ` ; ajustement : ${excerpt(test.adjustment, 14)}` : ""}`)
    .slice(0, 2)
    .join(". ");
  const risks = (source.risks || [])
    .filter(([risk, prevention]) => risk || prevention)
    .map(([risk, prevention]) => `${excerpt(risk || "un risque identifié", 15)}${prevention ? `, maîtrisé par ${excerpt(prevention, 12)}` : ""}`)
    .join(" ; ");
  const measurement = source.measurement || {};
  const adoption = source.adoption || {};

  const pitch = `[0:00–0:45 · LE PROBLÈME]
${excerpt(personal.opening || `Bonjour. Je présente le projet ${source.project || "[nom du projet]"}.`, 42)}

Dans ${excerpt(source.context || "mon contexte professionnel", 22)}, le problème est simple : ${excerpt(source.problem || "[décrire le problème observé]", 42)}. Mon objectif est ${excerpt(source.objective || "[préciser un objectif mesurable]", 28)}. L’IA répond donc à un besoin RH précis, et non à une recherche d’outil.

[0:45–1:35 · LE CHOIX]
J’ai retenu le processus ${excerpt(source.project || "[processus retenu]", 16)}. ${source.solutions.length ? `J’ai comparé ${source.solutions.slice(0, 2).join(" et ")}.` : "J’ai comparé deux solutions selon les critères utiles au projet."} Mon choix est conditionnel : ${excerpt(source.conditionalChoice || "[solution retenue et conditions à confirmer]", 48)}.

Le prototype repose sur un prompt de production structuré${source.controlPrompt ? " et un prompt de contrôle distinct" : ""}. ${excerpt(personal.keyIdea || source.humanDecision || "L’IA prépare un brouillon ; la validation et la diffusion restent humaines.", 34)}

[1:35–2:35 · LES TESTS ET GARDE-FOUS]
Les tests utilisent ${excerpt(source.allowedData || "des données fictives, synthétiques ou strictement autorisées", 25)}. Sont exclus : ${excerpt(source.forbiddenData || source.outOfScope || "les données et usages hors périmètre", 25)}. ${tests || "Les tests normal, limite, interdit, accessibilité et biais permettent de vérifier les écarts avant tout pilote."}

Les risques principaux sont ${excerpt(risks || "[risques et mesures de prévention]", 55)}. ${source.accessibility ? `L’exigence d’accessibilité est : ${excerpt(source.accessibility, 22)}.` : "Le résultat doit rester clair, accessible et vérifiable."} ${excerpt(source.humanDecision || "Un référent humain valide tout résultat sensible ou incertain.", 25)}

[2:35–3:50 · LE PILOTE ET LA MESURE]
Le pilote est limité à ${excerpt(source.perimeter || "[périmètre, public et durée]", 38)}. Les personnes concernées seront accompagnées par ${excerpt(adoption.diffusionActions || adoption.trainingAndSupport || "une information courte, une démonstration et un point de contact RH", 34)}.

Nous suivrons trois indicateurs : efficacité, qualité et relation humaine. La collecte prévue est ${excerpt(measurement.collectionPlan || "[source, fréquence et responsable de collecte]", 38)}. Elle sera complétée par ${excerpt(measurement.userFeedback || "un retour court des personnes concernées", 22)}. Cette mesure permet de vérifier que le temps gagné ne dégrade ni la qualité ni l’accompagnement humain.

[3:50–5:00 · LA LIMITE ET LA DÉCISION]
La limite que j’assume est ${excerpt(personal.limit || source.j2Limit || "[ce que le projet ne permet pas encore de conclure]", 38)}. Je ne transforme donc ni un test pédagogique ni une hypothèse en résultat réel.

Ma décision est ${source.finalDecision.decision || source.j2Decision || "[GO, GO sous conditions, AJUSTER ou STOP]"}, car ${excerpt(source.finalDecision.rationale || "[justification liée aux tests, risques et mesures]", 48)}. Le pilote sera suspendu si ${excerpt(source.finalDecision.stopRule || "[règle d’arrêt]", 30)}. La revue est prévue ${source.finalDecision.reviewDate ? `le ${source.finalDecision.reviewDate}` : "à une date déterminée"}.

La décision demandée aujourd’hui est : ${excerpt(personal.requestedDecision || source.finalDecision.nextAction || "[prochaine décision humaine]", 38)}.`;
  return limitPitchWords(pitch, MAX_PITCH_WORDS);
}

function countSource(source) {
  const values = [
    source.project, source.context, source.problem, source.objective, source.opportunity,
    source.conditionalChoice, source.promptV2, source.controlPrompt, source.allowedData,
    source.forbiddenData, source.perimeter, source.outOfScope, source.humanDecision,
    source.accessibility, source.j2Decision, source.j2Limit,
    ...source.solutions,
    ...Object.values(source.adoption || {}),
    ...Object.values(source.measurement || {}),
    ...Object.values(source.finalDecision || {}),
    ...Object.values(source.tests || {}).flatMap((test) => [test?.expected, test?.observed, test?.adjustment]),
  ];
  return values.filter((value) => String(value || "").trim()).length;
}

function testLabel(key) {
  return {
    normal: "test normal",
    limit: "test limite",
    forbidden: "test interdit",
    accessibility: "test d’accessibilité",
    bias: "test de biais et d’équité",
  }[key] || `test ${key}`;
}

function countWords(text) {
  return text.replace(/\[[^\]]+\]/g, "").trim().split(/\s+/).filter(Boolean).length;
}

function excerpt(value, maxWords) {
  const words = String(value || "").trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}…`;
}

function limitPitchWords(value, maxWords) {
  let remaining = maxWords;
  return String(value || "").split(/(\[[^\]]+\])/g).map((part) => {
    if (/^\[[^\]]+\]$/.test(part)) return part;
    const tokens = part.match(/\S+|\s+/g) || [];
    return tokens.map((token) => {
      if (/^\s+$/.test(token)) return token;
      if (remaining <= 0) return "";
      remaining -= 1;
      return token;
    }).join("");
  }).join("").trimEnd();
}

function estimatedTime(words) {
  const totalSeconds = Math.max(0, Math.round((words / 105) * 60));
  return formatTime(totalSeconds);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function formatMinute(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function PrintSummary({ source, personal }) {
  const answeredQuestions = QUESTIONS.filter(([key]) => personal.answers[key]);
  return <section className="pitch-print-summary">
    <header><p>FORMATION IA & RH · JOUR 3</p><h1>Fiche de soutenance — 5 minutes</h1><p><b>Projet :</b> {source.project || "À préciser"}<br /><b>Audience :</b> {personal.audience}</p></header>
    <h2>Trame à prononcer</h2>
    <p>{personal.script}</p>
    <h2>Quatre repères personnels</h2>
    <p><b>Ouverture :</b> {personal.opening || "À préciser"}<br /><b>Idée principale :</b> {personal.keyIdea || "À préciser"}<br /><b>Limite :</b> {personal.limit || "À préciser"}<br /><b>Décision demandée :</b> {personal.requestedDecision || "À préciser"}</p>
    {answeredQuestions.length > 0 && <><h2>Questions préparées</h2>{answeredQuestions.map(([key, question]) => <p key={key}><b>{question}</b><br />{personal.answers[key]}</p>)}</>}
  </section>;
}
