import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Database, FileCheck2, Lightbulb, MessageCircle,
  RefreshCw, Scale, ShieldCheck, Sparkles, WandSparkles,
} from "lucide-react";
import "./J2CertificationLab.css";

const STORAGE_KEY = "ia-rh-j2-bsi-certification-lab";

const chapters = [
  {
    title: "Cadrer l’entretien de parcours", icon: Scale, color: "violet", kicker: "BLOC 1 · PREUVE C2 · ENVIRON 18 MIN",
    subtitle: "Définir ce que le prototype prépare, ce qu’il ne décide pas et qui conserve la responsabilité.",
    takeaway: "Une trame d’entretien assistée par IA reste un brouillon de préparation, alimenté par des sources maîtrisées et validé par un professionnel.",
    cards: [
      ["Cadre 2026", "Un entretien de parcours, pas une évaluation.", "La trame prépare l’échange sur les compétences, le parcours, les besoins de formation et les souhaits d’évolution. Elle ne note pas le salarié et ne décide ni d’une mobilité, ni d’une formation."],
      ["À retenir", "La nouvelle trame a une finalité précise.", "Le projet vise à préparer une trame cohérente, lisible et adaptée au poste, afin de faciliter l’échange entre le salarié et son manager."],
      ["Garde-fou", "L’outil ne prend aucune décision.", "Il ne décide ni d’une évolution, ni d’une formation, ni d’une évaluation. Le manager et les RH conservent la préparation, la conduite et le suivi de l’entretien."],
    ],
    questions: [
      ["Quelle formulation décrit le mieux le périmètre du prototype ?", ["Générer automatiquement l’entretien et imposer les évolutions au salarié.", "Préparer une trame à partir de sources validées, puis la faire relire avant l’échange.", "Décider du parcours professionnel selon le profil du salarié."], 1, "Le prototype assiste la préparation d’un support. Les décisions concernant une personne restent sous responsabilité humaine."],
      ["Quel élément distingue l’entretien de parcours professionnel d’un entretien annuel d’évaluation ?", ["Il mesure la productivité et attribue une note.", "Il traite notamment du parcours, des compétences, des besoins de formation et des souhaits d’évolution, sans évaluer le travail du salarié.", "Il permet de décider automatiquement d’une promotion."], 1, "L’entretien de parcours professionnel est consacré à l’évolution professionnelle. La décision reste humaine et l’évaluation du travail relève d’un autre dispositif."],
    ],
    exchange: "Complétez oralement : « Nous utilisons l’IA pour préparer…, à partir de…, tout en conservant… ». Quelle phrase défendriez-vous pour votre nouvelle trame ?",
  },
  {
    title: "Choisir les données", icon: Database, color: "blue", kicker: "BLOC 2 · PREUVE C2 / C4 · ENVIRON 22 MIN",
    subtitle: "Distinguer ce qui est nécessaire, ce qui doit être confirmé et ce qui reste hors périmètre.",
    takeaway: "Un environnement interne autorisé n’autorise pas toutes les données : la finalité et la nécessité restent déterminantes.",
    cards: [
      ["À retenir", "Disponible ne veut pas dire nécessaire.", "Pour une trame d’entretien, une donnée doit être utile à la question préparée, provenir d’une source validée et être traitée dans le cadre interne autorisé."],
      ["Repères de cycle", "Déclencher sans exposer inutilement.", "L’employeur suit les échéances : première année, quatre ans, bilan à huit ans, retour d’absence, mi-carrière et fin de carrière. Dans le brouillon, on utilise un repère RH utile, pas l’âge, le salaire ou la date de naissance sans nécessité."],
      ["Exemple", "Une donnée de santé reste hors périmètre.", "Même si une organisation conserve légalement certaines informations, elles n’ont pas à alimenter une trame d’entretien d’évolution. En cas de doute, l’information est exclue ou soumise à validation compétente."],
    ],
    questions: [
      ["La trame est préparée dans un outil interne autorisé. Peut-on y verser toutes les informations RH disponibles ?", ["Oui, car l’outil est interne.", "Non : seules les informations nécessaires, autorisées et adaptées à la finalité doivent être utilisées.", "Oui, à condition de retirer uniquement le nom du salarié."], 1, "L’environnement compte, mais il ne supprime ni le principe de minimisation ni le besoin d’un cadre d’usage."],
      ["Quelle réaction est la plus prudente si une source ne permet pas de confirmer un besoin d’évolution ou de formation ?", ["Inventer une hypothèse pour compléter la trame.", "Retirer le sujet sans le signaler.", "Signaler l’information manquante, identifier la source ou la personne à consulter, puis faire valider."], 2, "Une information manquante devient un point à vérifier. Le prototype ne doit jamais compléter un fait professionnel par hypothèse."],
    ],
    exchange: "Pour votre trame, citez une donnée autorisée, une donnée à confirmer et une donnée clairement exclue. Quel repère d’échéance doit rester dans le pilotage RH plutôt que dans le prompt ?",
  },
  {
    title: "Produire un brouillon vérifiable", icon: WandSparkles, color: "coral", kicker: "BLOC 3 · PREUVE C3 · ENVIRON 22 MIN",
    subtitle: "Distinguer le prompt qui produit du prompt qui contrôle.",
    takeaway: "Le prompt de production prépare un texte ; le prompt de contrôle cherche les écarts avant diffusion.",
    cards: [
      ["Prompt de production", "Il formule une demande concrète.", "Il précise les sources autorisées, la période, les rubriques attendues, le ton et les informations à signaler comme manquantes. Il demande un brouillon, jamais une décision."],
      ["Rubriques attendues", "La structure rend la relecture possible.", "Le brouillon couvre parcours et compétences, évolution du métier, besoins de formation, souhaits d’évolution, CPF ou CEP si pertinent, puis actions à confirmer. Il distingue les informations factuelles des questions à poser."],
      ["Prompt de contrôle", "Il organise la relecture.", "Il demande de repérer les faits non sourcés, les incohérences, les rubriques absentes, les données non nécessaires et les formulations ambiguës."],
    ],
    questions: [
      ["Quelle consigne protège le mieux la préparation d’une trame d’entretien ?", ["Complète toutes les rubriques, même si des informations manquent.", "À partir des sources validées, prépare une trame ; signale séparément toute information manquante ou incertaine.", "Déduis les souhaits professionnels les plus probables du salarié."], 1, "Cette consigne rend le résultat contrôlable : elle sépare les faits disponibles des éléments à confirmer."],
      ["Quel est le rôle principal du prompt de contrôle ?", ["Générer une seconde version plus longue.", "Décider automatiquement si la trame est adaptée au salarié.", "Rechercher les écarts, manques et points de vigilance selon des critères explicites."], 2, "Le contrôle aide la relecture ; il ne remplace ni la validation RH, ni la décision de diffusion."],
    ],
    exchange: "Quelle information devrait obligatoirement être signalée comme « à vérifier » dans votre trame plutôt qu’inventée ?",
  },
  {
    title: "Tester le prototype", icon: ClipboardCheck, color: "amber", kicker: "BLOC 4 · PREUVE C4 · ENVIRON 30 MIN",
    subtitle: "Préparer des tests qui démontrent autant les limites que les résultats utiles.",
    takeaway: "Un bon résultat une fois ne prouve pas que le prototype est prêt : chaque test associe attendu, observé, action et trace.",
    cards: [
      ["Les cinq regards", "Tester au-delà du cas idéal.", "Cas normal, limite, interdit, accessibilité, biais et équité : les cinq catégories évitent de conclure trop vite à partir d’un seul résultat satisfaisant."],
      ["La trace", "Documenter sans alourdir.", "Pour chaque test, quatre lignes suffisent : le cas, l’attendu, l’observé, puis l’action décidée. Le résultat reste une preuve de pilote, jamais une garantie juridique."],
    ],
    questions: [
      ["Comment tester un cas interdit concernant une donnée de santé ?", ["Coller une donnée de santé réelle dans l’outil pour vérifier sa réaction.", "Décrire le scénario ou utiliser une donnée fictive, puis vérifier la règle d’exclusion et la réaction attendue.", "Ne pas parler des données interdites pour garder le test simple."], 1, "Un test ne justifie jamais l’utilisation d’une donnée réelle interdite. Le scénario fictif permet d’évaluer la règle et la décision attendue."],
      ["Quel contrôle convient avant de diffuser une nouvelle trame ?", ["Vérifier que le brouillon ne confond pas entretien de parcours et évaluation, couvre les rubriques utiles et n’utilise aucune donnée de santé.", "Vérifier seulement que la mise en page est plus moderne.", "Demander à l’IA de certifier la conformité juridique."], 0, "Ce contrôle est testable et proportionné. Il ne remplace ni une validation RH, ni l’analyse d’un conseil juridique si nécessaire."],
      ["Quelle trace rend le test défendable ?", ["« Cela semble fonctionner. »", "« Test normal : trame attendue ; une information manque ; action : demander validation RH avant utilisation ; trace : version corrigée datée. »", "« L’IA a validé l’entretien. »"], 1, "La trace doit rendre visible le lien entre le cas, l’observation, l’action humaine et la preuve conservée."],
    ],
    exchange: "Quel premier test normal allez-vous exécuter dans le Banc d’essai ? Quel cas limite préparerez-vous ensuite ?",
  },
  {
    title: "Décider et transmettre", icon: FileCheck2, color: "green", kicker: "BLOC 5 · PREUVE C4 · ENVIRON 18 MIN",
    subtitle: "Transformer les résultats en une décision humaine, datée et explicable.",
    takeaway: "GO, AJUSTER et STOP ne sont pas des notes : ce sont des décisions humaines motivées, associées à une personne et à une prochaine action.",
    cards: [
      ["Décision proportionnée", "AJUSTER est souvent la décision la plus professionnelle.", "Lorsque le brouillon est utile mais qu’une source, une rubrique ou une règle de relecture doit être corrigée, on ajuste, on re-teste et on consigne la condition de reprise."],
      ["Finaliser la preuve", "Le Studio J2 rassemble, il n’invente rien.", "Vous y retrouverez les sources, les prompts, le périmètre de données, le protocole de test et la décision finale. Chaque élément doit venir de votre travail validé."],
    ],
    questions: [
      ["La trame est claire, mais deux rubriques doivent être validées avec les RH avant utilisation. Quelle décision est la plus défendable ?", ["GO immédiat : la majorité du document est correcte.", "AJUSTER : faire confirmer les rubriques, corriger, puis re-tester avant utilisation.", "STOP définitif : un écart impose toujours l’abandon du projet."], 1, "AJUSTER rend l’écart visible, protège l’échange et prévoit une action proportionnée. Le GO pourra être décidé après correction et relecture."],
      ["Qu’est-ce qui manque à la formule « GO sous conditions » ?", ["Une couleur de statut.", "Les conditions, le responsable, la prochaine action et la date de revue.", "Un texte plus long généré par l’IA."], 1, "Une décision est défendable lorsqu’elle est motivée, attribuée et datée. L’outil peut documenter ; il ne décide pas."],
    ],
    exchange: "À ce stade, quelle décision provisoire défendriez-vous pour la trame : GO sous conditions, AJUSTER ou STOP ? Quelle condition est non négociable ?",
  },
];

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { answers: {}, notes: {} }; }
  catch { return { answers: {}, notes: {} }; }
}

function loadPromptProject() {
  try {
    const form = JSON.parse(localStorage.getItem("ia-rh-prompt-clinic") || "{}").form || {};
    return { contentType: form.contentType || "Trame d’entretien d’évolution", objective: form.objective || "À préciser dans Prompt Clinic", source: form.source || "À préciser dans Prompt Clinic" };
  } catch { return { contentType: "Trame d’entretien d’évolution", objective: "À préciser dans Prompt Clinic", source: "À préciser dans Prompt Clinic" }; }
}

function SectionHeading({ number, title, text }) {
  return <div className="j2lab-section-heading"><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>;
}

export function J2CertificationLab({ back, openTestBench }) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [progress, setProgress] = useState(loadProgress);
  const [revealed, setRevealed] = useState({});
  const project = useMemo(loadPromptProject, []);
  const chapter = chapters[chapterIndex];
  const Icon = chapter.icon;
  const completed = chapters.filter((item, index) => item.questions.every((_, questionIndex) => progress.answers[`${index}-${questionIndex}`] !== undefined)).length;
  const answered = Object.keys(progress.answers).length;
  const total = chapters.reduce((sum, item) => sum + item.questions.length, 0);

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)), [progress]);
  const choose = (questionIndex, answer) => {
    const key = `${chapterIndex}-${questionIndex}`;
    setProgress((current) => ({ ...current, answers: { ...current.answers, [key]: answer } }));
    setRevealed((current) => ({ ...current, [key]: true }));
  };
  const updateNote = (value) => setProgress((current) => ({ ...current, notes: { ...current.notes, [chapterIndex]: value } }));
  const reset = () => { if (window.confirm("Recommencer l’atelier ? Les réponses et notes de cet atelier seront effacées sur ce navigateur.")) { setProgress({ answers: {}, notes: {} }); setRevealed({}); setChapterIndex(0); } };

  return <main className="j2lab-shell">
    <header className="j2lab-topbar"><button onClick={back}><ArrowLeft size={18} /> Retour à la journée 2</button><div><span><BookOpen size={16} /></span> Atelier guidé · entretien de parcours</div><button onClick={reset}><RefreshCw size={14} /> Recommencer</button></header>
    <section className="j2lab-hero"><div><p>JOUR 2 · APPRENDRE POUR PRODUIRE SES PREUVES</p><h1>De la trame 2026<br /><span>au prototype défendable.</span></h1><div><ShieldCheck size={17} /> 5 blocs · notions, exemples, quiz expliqués et échanges</div></div><aside><span>{completed} / 5</span><b>blocs explorés</b><i><em style={{ width: `${(answered / total) * 100}%` }} /></i></aside></section>
    <section className="j2lab-project"><span><Sparkles size={17} /></span><div><b>Projet repris de Prompt Clinic</b><p><strong>{project.contentType}</strong> · {project.objective}</p><small>Sources déclarées : {project.source}</small></div></section>
    <section className="j2lab-layout"><aside className="j2lab-nav"><p>PREUVES À CONSTRUIRE</p>{chapters.map((item, index) => { const ChapterIcon = item.icon; const done = item.questions.every((_, questionIndex) => progress.answers[`${index}-${questionIndex}`] !== undefined); return <button type="button" key={item.title} onClick={() => setChapterIndex(index)} className={`${index === chapterIndex ? "active" : ""} ${done ? "done" : ""}`}><span>{done ? <CheckCircle2 size={16} /> : <ChapterIcon size={16} />}</span><b>{String(index + 1).padStart(2, "0")}</b><em>{item.title}</em></button>; })}<div><CircleHelp size={16} /> Répondez puis lisez le débrief : l’objectif est de préparer votre raisonnement de certification.</div></aside>
      <section className="j2lab-workspace"><header className="j2lab-heading"><span className={chapter.color}><Icon size={23} /></span><div><p>{chapter.kicker}</p><h2>{chapter.title}</h2><small>{chapter.subtitle}</small></div></header>
        <div className={`j2lab-takeaway ${chapter.color}`}><Lightbulb size={18} /><div><b>L’idée essentielle</b><p>{chapter.takeaway}</p></div></div>
        <SectionHeading number="01" title="Comprendre le repère" text="Deux notions courtes avant de vous positionner." />
        <div className="j2lab-cards">{chapter.cards.map(([label, title, text]) => <article key={title}><span>{label}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <SectionHeading number="02" title="Se positionner et comprendre" text="La réponse et son explication apparaissent immédiatement." />
        <div className="j2lab-questions">{chapter.questions.map(([question, choices, answer, explanation], questionIndex) => { const key = `${chapterIndex}-${questionIndex}`; const selected = progress.answers[key]; const isRevealed = revealed[key] || selected !== undefined; return <article key={question}><header><CircleHelp size={18} /> QUESTION {questionIndex + 1} / {chapter.questions.length}</header><h3>{question}</h3><div>{choices.map((choice, choiceIndex) => <button type="button" disabled={selected !== undefined} key={choice} onClick={() => choose(questionIndex, choiceIndex)} className={`${selected === choiceIndex ? "selected" : ""} ${isRevealed && choiceIndex === answer ? "correct" : ""} ${isRevealed && selected === choiceIndex && choiceIndex !== answer ? "incorrect" : ""}`}><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}{isRevealed && choiceIndex === answer && <CheckCircle2 size={18} />}</button>)}</div>{isRevealed && <aside className={selected === answer ? "success" : ""}><Lightbulb size={18} /><p><b>{selected === answer ? "Bonne lecture de la situation." : "La réponse attendue."}</b>{explanation}</p></aside>}</article>; })}</div>
        <SectionHeading number="03" title="Faire le lien avec la preuve" text="Temps d’échange : votre réponse n’est ni notée ni exportée automatiquement." />
        <section className="j2lab-exchange"><div><MessageCircle size={20} /> QUESTION À DISCUTER EN CLASSE VIRTUELLE</div><h3>{chapter.exchange}</h3><label>Ma note de travail <small>facultative · conservée uniquement dans ce navigateur</small><textarea value={progress.notes[chapterIndex] || ""} onChange={(event) => updateNote(event.target.value)} placeholder="Un point à retenir, une réponse à transférer dans le Banc d’essai, une question à poser…" /></label></section>
        <footer className="j2lab-actions"><button type="button" disabled={chapterIndex === 0} onClick={() => setChapterIndex((current) => current - 1)}><ChevronLeft size={18} /> Bloc précédent</button>{chapterIndex < chapters.length - 1 ? <button type="button" className="primary" onClick={() => setChapterIndex((current) => current + 1)}>Bloc suivant <ChevronRight size={18} /></button> : <button type="button" className="primary" onClick={openTestBench}>Passer au Banc d’essai <ArrowRight size={18} /></button>}</footer>
      </section>
    </section>
  </main>;
}
