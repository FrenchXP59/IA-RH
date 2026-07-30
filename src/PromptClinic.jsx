/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BadgeCheck, Check, CheckCircle2, ClipboardCheck,
  Copy, Download, FileCheck2, FileText, Lightbulb, RotateCcw, Save,
  ShieldCheck, Sparkles, WandSparkles,
} from "lucide-react";

const steps = [
  ["Cadrer", FileText],
  ["Construire", WandSparkles],
  ["Produire", Sparkles],
  ["Contrôler", ClipboardCheck],
  ["Finaliser", FileCheck2],
];

const contentTypes = ["Offre d’emploi", "Mail RH", "Trame d’entretien", "Note d’information", "Brouillon de plan de développement individuel"];
const outputFormats = ["Texte structuré", "Tableau", "Plan détaillé", "Brouillon prêt à relire"];
const tones = ["Clair et direct", "Inclusif", "Chaleureux", "Institutionnel"];
const controlItems = [
  ["facts", "Faits à confirmer", "Signaler les informations absentes, imprécises ou invérifiables."],
  ["inclusion", "Inclusion & équité", "Repérer les formulations stéréotypées, excluantes ou ambiguës."],
  ["privacy", "Confidentialité", "Détecter toute donnée personnelle ou détail à exclure."],
  ["clarity", "Clarté & ton", "Vérifier la structure, la compréhension et l’adéquation au public."],
];

const defaultForm = {
  useCase: "", audience: "", source: "", contentType: "Offre d’emploi", objective: "",
  tone: "Inclusif", constraints: "", outputFormat: "Brouillon prêt à relire", productionPrompt: "",
  controlPrompt: "", finalNotes: "", controls: { facts: true, inclusion: true, privacy: true, clarity: true },
};

export function PromptClinic({ back }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    try { return { ...defaultForm, ...JSON.parse(localStorage.getItem("ia-rh-prompt-clinic") || "{}").form, controls: { ...defaultForm.controls, ...JSON.parse(localStorage.getItem("ia-rh-prompt-clinic") || "{}").form?.controls } }; }
    catch { return defaultForm; }
  });
  const [copied, setCopied] = useState("");
  const [exported, setExported] = useState(false);
  useEffect(() => localStorage.setItem("ia-rh-prompt-clinic", JSON.stringify({ form })), [form]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const setControl = (key) => setForm((current) => ({ ...current, controls: { ...current.controls, [key]: !current.controls[key] } }));
  const draft = useMemo(() => buildProductionPrompt(form), [form]);
  const controlDraft = useMemo(() => buildControlPrompt(form), [form]);
  const filled = [form.useCase, form.audience, form.source, form.objective, form.constraints, form.productionPrompt, form.controlPrompt, form.finalNotes].filter(Boolean).length;

  const copy = async (kind, value) => {
    try { await navigator.clipboard?.writeText(value); setCopied(kind); window.setTimeout(() => setCopied(""), 1800); }
    catch { setCopied(""); }
  };
  const exportSheet = () => { setExported(true); window.print(); };

  return <main className="pc-shell">
    <header className="pc-topbar">
      <button className="pc-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 2</button>
      <div className="pc-brand"><span><WandSparkles size={17} /></span> Prompt Clinic</div>
      <div className="pc-save"><Save size={15} /> Sauvegarde locale</div>
    </header>

    <section className="pc-hero">
      <div className="pc-hero-image" role="img" aria-label="Professionnelle RH relisant un document de travail avec l’aide de l’intelligence artificielle" />
      <div className="pc-hero-content">
        <p className="pc-eyebrow">JOUR 2 · ATELIER INTERACTIF</p>
        <h1>Du besoin RH<br /><span>au prompt maîtrisé.</span></h1>
        <p>Créez un prompt de production utile, puis son prompt de contrôle. Le résultat est un brouillon à relire, jamais une décision automatique.</p>
        <div className="pc-pills"><span><ShieldCheck size={15} /> Sans données personnelles réelles</span><span><BadgeCheck size={15} /> 5 étapes guidées</span></div>
      </div>
    </section>

    <section className="pc-layout">
      <aside className="pc-stepper">
        <p>VOTRE PARCOURS</p>
        {steps.map(([label, Icon], index) => <button className={index === step ? "active" : index < step ? "done" : ""} onClick={() => setStep(index)} key={label}><span>{index < step ? <Check size={15} /> : <Icon size={16} />}</span><b>{String(index + 1).padStart(2, "0")}</b>{label}</button>)}
        <div className="pc-progress-note"><Sparkles size={16} /><p><b>{filled} repères renseignés</b> pour votre fiche de production.</p></div>
      </aside>

      <section className="pc-workspace">
        <div className="pc-step-heading"><span>ÉTAPE {step + 1} / 5</span><div><h2>{steps[step][0]}</h2><p>{stepDescriptions[step]}</p></div></div>
        {step === 0 && <Frame form={form} update={update} />}
        {step === 1 && <Build form={form} update={update} />}
        {step === 2 && <Production form={form} update={update} draft={draft} copy={copy} copied={copied} />}
        {step === 3 && <Control form={form} update={update} setControl={setControl} draft={controlDraft} copy={copy} copied={copied} />}
        {step === 4 && <Finish form={form} update={update} draft={draft} controlDraft={controlDraft} copy={copy} copied={copied} />}
        <div className="pc-actions">
          <button className="pc-secondary" disabled={step === 0} onClick={() => setStep((current) => current - 1)}><ArrowLeft size={17} /> Précédent</button>
          {step < 4 ? <button className="pc-primary" onClick={() => setStep((current) => current + 1)}>Continuer <ArrowRight size={17} /></button> : <button className="pc-primary" onClick={exportSheet}><Download size={17} /> Exporter ma fiche</button>}
        </div>
        {exported && <p className="pc-exported"><CheckCircle2 size={17} /> Votre fiche est prête. Dans la fenêtre d’impression, choisissez « Enregistrer au format PDF ».</p>}
      </section>

      <aside className="pc-live">
        <div className="pc-live-image" />
        <div className="pc-live-body">
          <div className="pc-live-label"><span /> PROMPT EN CONSTRUCTION</div>
          <h3>{form.contentType}</h3>
          <p>{form.objective || "Votre objectif métier apparaîtra ici."}</p>
          <div className="pc-live-row"><b>Public</b><span>{form.audience || "À préciser"}</span></div>
          <div className="pc-live-row"><b>Ton</b><span>{form.tone}</span></div>
          <div className="pc-live-score"><span>Contrôles actifs</span><strong>{Object.values(form.controls).filter(Boolean).length}<small> / 4</small></strong><i><b style={{ width: `${Object.values(form.controls).filter(Boolean).length * 25}%` }} /></i></div>
          <div className="pc-human"><ShieldCheck size={16} /><span>Publication après<br /><b>relecture humaine</b></span></div>
        </div>
      </aside>
    </section>
    <PrintSummary form={form} draft={draft} controlDraft={controlDraft} />
  </main>;
}

const stepDescriptions = [
  "Partir d’un problème RH et de sources maîtrisées : une bonne consigne ne commence pas par l’outil.",
  "Rendez votre demande concrète : objectif, ton, contraintes et format de sortie attendu.",
  "Assemblez une première consigne qui produit un brouillon directement exploitable.",
  "Demandez à l’IA de chercher les écarts : ce second prompt prépare votre relecture, il ne la remplace pas.",
  "Relisez vos deux consignes, notez le test à réaliser et exportez votre fiche de production.",
];

function Field({ label, hint, value, onChange, placeholder, area = false }) {
  const Input = area ? "textarea" : "input";
  return <label className="pc-field"><span>{label}{hint && <small>{hint}</small>}</span><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function ChoiceRow({ label, choices, value, onChange }) {
  return <div className="pc-choice-row"><b>{label}</b><div>{choices.map((choice) => <button type="button" className={choice === value ? "selected" : ""} onClick={() => onChange(choice)} key={choice}>{choice}</button>)}</div></div>;
}

function Frame({ form, update }) {
  return <div className="pc-form-grid two">
    <Field area label="Situation RH à améliorer" hint="Décrivez l’irritant, pas l’outil souhaité." value={form.useCase} onChange={(value) => update("useCase", value)} placeholder="Ex. les offres sont longues à harmoniser et leur qualité varie selon la personne qui les rédige." />
    <Field label="Public destinataire" value={form.audience} onChange={(value) => update("audience", value)} placeholder="Ex. candidats externes, managers, salariés…" />
    <Field area label="Sources autorisées" hint="Utilisez uniquement des contenus fictifs, publics ou validés." value={form.source} onChange={(value) => update("source", value)} placeholder="Ex. fiche de poste validée et référentiel de compétences anonymisé." />
    <div className="pc-reminder"><ShieldCheck size={20} /><div><b>Point de vigilance</b><p>Ne collez ni CV, ni verbatim identifiable, ni donnée sur la situation personnelle d’un candidat ou d’un salarié.</p></div></div>
  </div>;
}

function Build({ form, update }) {
  return <div className="pc-build">
    <div className="pc-callout"><Lightbulb size={20} /><div><b>Un prompt professionnel rend la relecture possible.</b><p>Il précise le résultat attendu, les limites et le rôle de la personne qui validera le brouillon.</p></div></div>
    <ChoiceRow label="Type de contenu" choices={contentTypes} value={form.contentType} onChange={(value) => update("contentType", value)} />
    <Field area label="Objectif concret" value={form.objective} onChange={(value) => update("objective", value)} placeholder="Ex. proposer une offre structurée, inclusive et cohérente avec la fiche de poste." />
    <ChoiceRow label="Ton attendu" choices={tones} value={form.tone} onChange={(value) => update("tone", value)} />
    <Field area label="Contraintes et garde-fous" value={form.constraints} onChange={(value) => update("constraints", value)} placeholder="Ex. ne pas inventer de salaire, signaler les informations manquantes, éviter tout critère discriminatoire." />
    <ChoiceRow label="Format de sortie" choices={outputFormats} value={form.outputFormat} onChange={(value) => update("outputFormat", value)} />
  </div>;
}

function Production({ form, update, draft, copy, copied }) {
  return <div className="pc-prompt-stage">
    <div className="pc-callout blue"><WandSparkles size={20} /><div><b>Le prompt de production crée un premier brouillon.</b><p>Il ne valide pas le contenu, ne décide pas à votre place et ne remplace pas une vérification humaine.</p></div></div>
    <div className="pc-draft-head"><div><span>TRAME SUGGÉRÉE</span><p>Adaptez-la à votre contexte avant de la copier dans l’outil autorisé.</p></div><button className="pc-text-button" onClick={() => update("productionPrompt", draft)}>Utiliser cette trame</button></div>
    <pre className="pc-draft-preview">{draft}</pre>
    <Field area label="Mon prompt de production" hint="Vous pouvez modifier la trame proposée." value={form.productionPrompt} onChange={(value) => update("productionPrompt", value)} placeholder="Votre prompt apparaîtra ici après avoir utilisé la trame." />
    {form.productionPrompt && <button className="pc-copy-button" onClick={() => copy("production", form.productionPrompt)}><Copy size={16} /> {copied === "production" ? "Prompt copié" : "Copier le prompt"}</button>}
  </div>;
}

function Control({ form, update, setControl, draft, copy, copied }) {
  return <div className="pc-control-stage">
    <div className="pc-callout violet"><ClipboardCheck size={20} /><div><b>Un prompt de contrôle cherche ce qui peut poser problème.</b><p>Il rend visibles les écarts avant diffusion ; la décision de corriger, d’ajuster ou d’arrêter reste humaine.</p></div></div>
    <div className="pc-check-list">{controlItems.map(([key, title, text]) => <button className={`pc-check-card ${form.controls[key] ? "checked" : ""}`} onClick={() => setControl(key)} key={key}><span>{form.controls[key] ? <Check size={15} /> : ""}</span><div><b>{title}</b><p>{text}</p></div></button>)}</div>
    <div className="pc-draft-head"><div><span>PROMPT DE CONTRÔLE SUGGÉRÉ</span><p>Il vise une analyse structurée, pas un simple « Est-ce que c’est bon ? ».</p></div><button className="pc-text-button" onClick={() => update("controlPrompt", draft)}>Utiliser cette trame</button></div>
    <pre className="pc-draft-preview control">{draft}</pre>
    <Field area label="Mon prompt de contrôle" value={form.controlPrompt} onChange={(value) => update("controlPrompt", value)} placeholder="Votre prompt de contrôle apparaîtra ici après avoir utilisé la trame." />
    {form.controlPrompt && <button className="pc-copy-button" onClick={() => copy("control", form.controlPrompt)}><Copy size={16} /> {copied === "control" ? "Prompt copié" : "Copier le prompt de contrôle"}</button>}
  </div>;
}

function Finish({ form, update, draft, controlDraft, copy, copied }) {
  const production = form.productionPrompt || draft;
  const control = form.controlPrompt || controlDraft;
  return <div className="pc-finish">
    <div className="pc-ready"><CheckCircle2 size={22} /><div><b>Vos deux prompts sont prêts à être testés.</b><p>Utilisez un cas fictif ou autorisé. Conservez la version relue et les écarts observés : ils nourriront votre décision de test.</p></div></div>
    <PromptBlock title="01 · Prompt de production" text={production} onCopy={() => copy("finish-production", production)} copied={copied === "finish-production"} />
    <PromptBlock title="02 · Prompt de contrôle" text={control} onCopy={() => copy("finish-control", control)} copied={copied === "finish-control"} />
    <Field area label="Mon protocole de test / ma prochaine action" hint="Ex. tester sur une fiche de poste fictive puis faire relire le brouillon par un manager et les RH." value={form.finalNotes} onChange={(value) => update("finalNotes", value)} placeholder="Décrivez le test et la personne qui gardera la décision finale." />
  </div>;
}

function PromptBlock({ title, text, onCopy, copied }) {
  return <section className="pc-prompt-block"><div><b>{title}</b><button onClick={onCopy}><Copy size={15} /> {copied ? "Copié" : "Copier"}</button></div><p>{text}</p></section>;
}

function buildProductionPrompt(form) {
  return `Tu es un assistant de rédaction RH.\n\nContexte : ${form.useCase || "[décrire le besoin RH]"}\nPublic : ${form.audience || "[préciser le public]"}\nSources autorisées : ${form.source || "[indiquer les sources autorisées]"}\n\nTâche : rédiger un premier brouillon de ${form.contentType.toLowerCase()} afin de ${form.objective || "[préciser l’objectif]"}.\n\nContraintes : ${form.constraints || "ne pas inventer d’information ; signaler les éléments manquants ; ne pas utiliser de données personnelles réelles ; éviter toute formulation discriminatoire."}\nTon : ${form.tone.toLowerCase()}.\nFormat attendu : ${form.outputFormat.toLowerCase()}.\n\nAvant de répondre, liste séparément les informations indispensables qui manquent. Le résultat reste un brouillon à relire et à valider par une personne responsable.`;
}

function buildControlPrompt(form) {
  const controls = controlItems.filter(([key]) => form.controls[key]).map(([, title, text]) => `- ${title} : ${text}`).join("\n");
  return `Tu es un relecteur qualité RH. Analyse le brouillon ci-dessous avant toute diffusion.\n\nContexte : ${form.useCase || "[décrire le besoin RH]"}\nPublic : ${form.audience || "[préciser le public]"}\n\nVérifie précisément :\n${controls || "- Les faits, l’inclusion, la confidentialité et la clarté."}\n\nPour chaque écart, indique : 1) l’extrait concerné, 2) le risque ou la lacune, 3) une proposition de correction, 4) le niveau de priorité.\nConclue par une recommandation : prêt à relire / à ajuster / à ne pas diffuser. Ne prends aucune décision à la place du responsable RH.\n\nBrouillon à analyser :\n[coller ici le résultat du prompt de production]`;
}

function PrintSummary({ form, draft, controlDraft }) {
  return <section className="pc-print-summary"><h1>Prompt Clinic — Fiche de production J2</h1><h2>Contexte</h2><p><b>Situation :</b> {form.useCase || "Non renseignée"}<br /><b>Public :</b> {form.audience || "Non renseigné"}<br /><b>Sources :</b> {form.source || "Non renseignées"}</p><h2>Prompt de production</h2><p>{form.productionPrompt || draft}</p><h2>Prompt de contrôle</h2><p>{form.controlPrompt || controlDraft}</p><h2>Prochaine action</h2><p>{form.finalNotes || "Non renseignée"}</p></section>;
}
