/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, CheckCircle2, CircleAlert,
  CircleCheck, CircleX, ClipboardCheck, Download, FileCheck2, FlaskConical,
  ScanSearch, Save, ShieldCheck, Sparkles,
} from "lucide-react";

const steps = [
  ["Choisir", FlaskConical],
  ["Examiner", ScanSearch],
  ["Décider", ClipboardCheck],
  ["Tracer", FileCheck2],
];

const scenarios = {
  offer: {
    title: "Brouillon d’offre d’emploi", tag: "Cas Novalys · rédaction assistée", expected: ["age", "missing"], decision: "AJUSTER",
    purpose: "Préparer une première version d’une offre à partir d’une fiche de poste validée.",
    source: "Fiche de poste fictive et référentiel métier validé — aucune donnée de candidat.",
    text: "Nous recherchons un jeune chargé de recrutement dynamique pour rejoindre notre équipe. Vous serez au cœur d’une entreprise en pleine croissance et bénéficierez d’une évolution rapide. Vous assurerez la publication des annonces et les premiers échanges avec les candidats. Rémunération selon profil.",
    flags: [
      ["age", "Formulation pouvant créer un critère d’âge", "« jeune » n’est pas nécessaire pour décrire les compétences attendues."],
      ["missing", "Informations importantes à confirmer", "Le contrat, la localisation et la rémunération ne sont pas assez précis."],
      ["decision", "Décision de recrutement automatisée", "Le brouillon ne propose aucune décision automatique concernant des candidats."],
      ["privacy", "Donnée personnelle non autorisée", "Le brouillon ne contient pas de donnée personnelle identifiable."],
    ],
  },
  manager: {
    title: "Mail d’information aux managers", tag: "Cas Novalys · accompagnement au changement", expected: ["frame", "promise"], decision: "AJUSTER",
    purpose: "Préparer un mail présentant un atelier de découverte de l’IA pour les managers.",
    source: "Programme fictif de l’atelier et règles internes de formation.",
    text: "Dès lundi, l’IA sera déployée pour simplifier tous vos recrutements. L’outil saura identifier les meilleurs profils et vous fera gagner un temps considérable. Inscrivez-vous à l’atelier : nous répondrons aux détails juridiques si nécessaire.",
    flags: [
      ["frame", "Cadre d’usage insuffisamment précisé", "Le texte annonce un déploiement sans préciser le périmètre, le pilote ni le rôle humain."],
      ["promise", "Promesse non vérifiée ou excessive", "L’outil ne peut pas « identifier les meilleurs profils » sans risques et sans validation humaine."],
      ["privacy", "Donnée personnelle non autorisée", "Le mail ne contient aucune donnée personnelle réelle."],
      ["neutral", "Ton clair et prudent", "Le ton doit être ajusté : il est ici trop affirmatif."],
    ],
  },
  verbatim: {
    title: "Synthèse de verbatims collaborateurs", tag: "Cas Novalys · contenu à exclure", expected: ["reid", "source"], decision: "STOP",
    purpose: "Synthétiser des retours recueillis lors d’un atelier interne.",
    source: "Verbatims fictifs inspirés d’un atelier — aucun texte réel ne doit être transféré dans un outil non autorisé.",
    text: "Les retours de la seule responsable de l’atelier de Bessé montrent une inquiétude persistante depuis son retour de congé maladie. Elle estime que la charge d’équipe devient intenable. Les autres participants confirment sa situation.",
    flags: [
      ["reid", "Risque de ré-identification", "Un lieu rare, une fonction unique et une situation personnelle permettent d’identifier une personne."],
      ["source", "Donnée à exclure ou à reformuler", "La mention de santé et les détails individuels ne doivent pas être transmis sous cette forme."],
      ["neutral", "Texte déjà anonymisé", "Retirer un nom ne suffit pas à anonymiser un verbatim."],
      ["go", "Brouillon directement diffusable", "Ce contenu doit d’abord être retiré ou remplacé par un cas synthétique."],
    ],
  },
};

const defaultForm = { scenario: "offer", flags: [], decision: "", corrections: "", reviewer: "", rationale: "" };

export function TestBench({ back }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    try { return { ...defaultForm, ...JSON.parse(localStorage.getItem("ia-rh-test-bench") || "{}").form }; }
    catch { return defaultForm; }
  });
  const [exported, setExported] = useState(false);
  const scenario = scenarios[form.scenario];
  useEffect(() => localStorage.setItem("ia-rh-test-bench", JSON.stringify({ form })), [form]);
  const toggleFlag = (key) => setForm((current) => ({ ...current, flags: current.flags.includes(key) ? current.flags.filter((item) => item !== key) : [...current.flags, key] }));
  const chooseScenario = (key) => setForm((current) => ({ ...current, scenario: key, flags: [], decision: "", corrections: "", rationale: "" }));
  const coverage = useMemo(() => scenario.expected.filter((key) => form.flags.includes(key)).length, [scenario, form.flags]);
  const extraFlags = form.flags.filter((key) => !scenario.expected.includes(key)).length;
  const issuesFound = coverage === scenario.expected.length && extraFlags === 0;
  const decisionRight = form.decision === scenario.decision;
  const status = form.decision ? form.decision.toLowerCase() : "pending";

  return <main className="tb-shell">
    <header className="tb-topbar">
      <button className="tb-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 2</button>
      <div className="tb-brand"><span><FlaskConical size={17} /></span> Banc d’essai IA RH</div>
      <div className="tb-save"><Save size={15} /> Sauvegarde locale</div>
    </header>

    <section className="tb-hero">
      <div className="tb-hero-image" role="img" aria-label="Professionnelle RH relisant un document de travail avec l’aide de l’intelligence artificielle" />
      <div className="tb-hero-content">
        <p className="tb-eyebrow">JOUR 2 · SIMULATEUR DE DÉCISION</p>
        <h1>Tester avant<br /><span>de diffuser.</span></h1>
        <p>Observez un résultat fictif, repérez les écarts et décidez : GO, AJUSTER ou STOP. Une expérimentation crédible se trace et se corrige.</p>
        <div className="tb-pills"><span><ShieldCheck size={15} /> Cas Novalys fictifs</span><span><BadgeCheck size={15} /> Décision humaine</span></div>
      </div>
    </section>

    <section className="tb-layout">
      <aside className="tb-stepper">
        <p>VOTRE ESSAI</p>
        {steps.map(([label, Icon], index) => <button className={index === step ? "active" : index < step ? "done" : ""} onClick={() => setStep(index)} key={label}><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{String(index + 1).padStart(2, "0")}</b>{label}</button>)}
        <div className={`tb-status-mini ${status}`}><span className="tb-status-dot" /><div><b>{form.decision ? `Décision : ${form.decision}` : "Décision à venir"}</b><small>{form.flags.length} signalement{form.flags.length > 1 ? "s" : ""} relevé{form.flags.length > 1 ? "s" : ""}</small></div></div>
      </aside>

      <section className="tb-workspace">
        <div className="tb-step-heading"><span>ÉTAPE {step + 1} / 4</span><div><h2>{steps[step][0]}</h2><p>{stepDescriptions[step]}</p></div></div>
        {step === 0 && <ScenarioChoice selected={form.scenario} choose={chooseScenario} />}
        {step === 1 && <Review scenario={scenario} flags={form.flags} toggleFlag={toggleFlag} coverage={coverage} />}
        {step === 2 && <Decision form={form} update={(field, value) => setForm((current) => ({ ...current, [field]: value }))} scenario={scenario} issuesFound={issuesFound} coverage={coverage} extraFlags={extraFlags} />}
        {step === 3 && <Trace form={form} scenario={scenario} issuesFound={issuesFound} decisionRight={decisionRight} coverage={coverage} extraFlags={extraFlags} />}
        <div className="tb-actions">
          <button className="tb-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Précédent</button>
          {step < 3 ? <button className="tb-primary" onClick={() => setStep((current) => current + 1)}>Continuer <ArrowRight size={17} /></button> : <button className="tb-primary" onClick={() => { setExported(true); window.print(); }}><Download size={17} /> Exporter ma fiche de test</button>}
        </div>
        {exported && <p className="tb-exported"><CheckCircle2 size={17} /> Votre fiche de test est prête. Dans la fenêtre d’impression, choisissez « Enregistrer au format PDF ».</p>}
      </section>

      <aside className="tb-live">
        <div className="tb-live-image" />
        <div className="tb-live-body">
          <div className="tb-live-label"><span /> TEST EN COURS</div>
          <h3>{scenario.title}</h3>
          <p>{scenario.purpose}</p>
          <div className="tb-live-row"><b>Écarts relevés</b><span>{coverage} / {scenario.expected.length}</span></div>
          <div className="tb-live-row"><b>Relecture humaine</b><span>{form.reviewer || "À préciser"}</span></div>
          <div className={`tb-live-decision ${status}`}><span>Décision proposée</span><b>{form.decision || "À décider"}</b></div>
          <div className="tb-human"><ShieldCheck size={16} /><span>Le résultat est un<br /><b>support de décision</b></span></div>
        </div>
      </aside>
    </section>
    <PrintSummary form={form} scenario={scenario} issuesFound={issuesFound} decisionRight={decisionRight} />
  </main>;
}

const stepDescriptions = [
  "Sélectionnez un cas fictif. Les trois situations illustrent des résultats possibles : ajustables, risqués ou à exclure.",
  "Lisez le résultat comme un relecteur RH : identifiez les éléments précis qui exigent une correction ou un arrêt.",
  "Choisissez une décision explicite et consignez la correction ou le garde-fou qui permettrait de poursuivre le test.",
  "Votre fiche rend le test défendable : résultat observé, décision, responsable de relecture et prochaine action.",
];

function ScenarioChoice({ selected, choose }) {
  return <div className="tb-scenarios">{Object.entries(scenarios).map(([key, scenario]) => <button className={`tb-scenario ${selected === key ? "selected" : ""}`} onClick={() => choose(key)} key={key}><span>{selected === key ? <Check size={17} /> : ""}</span><div><em>{scenario.tag}</em><h3>{scenario.title}</h3><p>{scenario.purpose}</p><footer><b>Décision pédagogique attendue :</b> {scenario.decision}</footer></div><ArrowRight size={18} /></button>)}</div>;
}

function Review({ scenario, flags, toggleFlag, coverage }) {
  return <div className="tb-review">
    <div className="tb-source"><ShieldCheck size={19} /><div><b>Source du test</b><p>{scenario.source}</p></div></div>
    <article className="tb-result-card"><div><span>RÉSULTAT PRODUIT PAR L’IA · FICTIF</span><b>{scenario.title}</b></div><p>{scenario.text}</p></article>
    <div className="tb-review-head"><div><h3>Quels écarts repérez-vous ?</h3><p>Cochez uniquement ce que vous pouvez justifier dans le résultat.</p></div><span>{coverage} repéré{coverage > 1 ? "s" : ""}</span></div>
    <div className="tb-flag-list">{scenario.flags.map(([key, title, help]) => <button className={`tb-flag ${flags.includes(key) ? "checked" : ""}`} onClick={() => toggleFlag(key)} key={key}><span>{flags.includes(key) ? <Check size={15} /> : ""}</span><div><b>{title}</b><p>{help}</p></div></button>)}</div>
  </div>;
}

function Decision({ form, update, scenario, issuesFound, coverage, extraFlags }) {
  return <div className="tb-decision-stage">
    <div className={`tb-review-feedback ${issuesFound ? "good" : ""}`}><CircleAlert size={20} /><div><b>{issuesFound ? "Votre analyse couvre les écarts clés du scénario." : "Votre analyse peut encore être affinée."}</b><p>{issuesFound ? "Vous pouvez maintenant justifier une décision proportionnée." : `${coverage} écart clé sur ${scenario.expected.length} est identifié${extraFlags ? ", et un signalement mérite d’être reconsidéré" : ""}. Relisez le résultat avant de trancher.`}</p></div></div>
    <h3>Quelle décision prenez-vous ?</h3>
    <div className="tb-decision-options">{[
      ["GO", CircleCheck, "Les critères sont atteints, les limites sont connues et la relecture humaine est possible."],
      ["AJUSTER", CircleAlert, "Un écart est identifié mais une correction et un nouveau test peuvent le résoudre."],
      ["STOP", CircleX, "Un risque ou un prérequis non maîtrisé impose de suspendre ou d’exclure le cas."],
    ].map(([decision, Icon, text]) => <button className={`${decision.toLowerCase()} ${form.decision === decision ? "selected" : ""}`} onClick={() => update("decision", decision)} key={decision}><Icon size={20} /><div><b>{decision}</b><p>{text}</p></div></button>)}</div>
    <label className="tb-field"><span>Correction, garde-fou ou règle d’arrêt</span><textarea value={form.corrections} onChange={(event) => update("corrections", event.target.value)} placeholder="Ex. remplacer les formulations problématiques, faire valider les informations manquantes, puis tester une nouvelle version." /></label>
    <label className="tb-field"><span>Personne qui garde la décision humaine</span><input value={form.reviewer} onChange={(event) => update("reviewer", event.target.value)} placeholder="Ex. responsable recrutement ou manager habilité." /></label>
  </div>;
}

function Trace({ form, scenario, issuesFound, decisionRight, coverage, extraFlags }) {
  const indicator = !form.decision ? ["pending", "Décision à compléter", "La fiche reste ouverte tant qu’une décision n’est pas formulée."] : decisionRight ? ["good", "Décision cohérente avec le scénario", "Votre décision est proportionnée au niveau de risque observé."] : ["adjust", "Décision à réinterroger", `Dans ce scénario pédagogique, la décision attendue est « ${scenario.decision} ». Relisez les écarts et la règle de prudence.`];
  return <div className="tb-trace">
    <div className={`tb-ready ${indicator[0]}`}><BadgeCheck size={22} /><div><b>{indicator[1]}</b><p>{indicator[2]}</p></div></div>
    <dl className="tb-summary"><div><dt>Cas testé</dt><dd>{scenario.title}</dd></div><div><dt>Écarts relevés</dt><dd>{coverage} écart{coverage > 1 ? "s" : ""} clé{coverage > 1 ? "s" : ""}{extraFlags ? ` · ${extraFlags} à reconsidérer` : ""}</dd></div><div><dt>Décision</dt><dd><span className={`tb-decision-badge ${form.decision ? form.decision.toLowerCase() : "pending"}`}>{form.decision || "À décider"}</span></dd></div><div><dt>Relecteur / décideur</dt><dd>{form.reviewer || "À préciser"}</dd></div><div><dt>Correction ou garde-fou</dt><dd>{form.corrections || "À préciser"}</dd></div></dl>
    {!issuesFound && <div className="tb-soft-note"><Sparkles size={17} /><p>Le débrief pédagogique apparaît dans le quiz J2. Ici, l’enjeu est de rendre votre raisonnement visible : extrait, risque, correction, décision, puis nouveau test si nécessaire.</p></div>}
    <label className="tb-field"><span>Justification courte pour la fiche J2</span><textarea value={form.rationale} onChange={(event) => update("rationale", event.target.value)} placeholder="Ex. AJUSTER : le brouillon est utile mais doit être corrigé avant diffusion. Les informations manquantes seront validées par les RH." /></label>
  </div>;
}

function PrintSummary({ form, scenario, issuesFound, decisionRight }) {
  return <section className="tb-print-summary"><h1>Banc d’essai IA RH — Fiche de test J2</h1><h2>Cas testé</h2><p><b>{scenario.title}</b><br />{scenario.purpose}</p><h2>Écarts et décision</h2><p><b>Signalements relevés :</b> {form.flags.length || "Aucun"}<br /><b>Décision :</b> {form.decision || "À compléter"}<br /><b>Relecteur :</b> {form.reviewer || "À préciser"}</p><h2>Correction / garde-fou</h2><p>{form.corrections || "À préciser"}</p><h2>Justification</h2><p>{form.rationale || "À préciser"}</p><p><small>Analyse pédagogique : {issuesFound ? "écarts clés identifiés" : "analyse à poursuivre"} · {decisionRight ? "décision cohérente" : "décision à réinterroger"}.</small></p></section>;
}
