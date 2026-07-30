/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, BrainCircuit,
  CheckCircle2, ChevronRight, ClipboardCheck, Clock3, ExternalLink, FileDown, FileText, Film,
  KeyRound, LockKeyhole, Play, Rocket, Scale, ShieldCheck, Sparkles, Target,
  UserRound, WandSparkles, X,
} from "lucide-react";
import { Cartographer } from "./Cartographer";
import { DataTrafficLight } from "./DataTrafficLight";
import { ArbitrationMatrix } from "./ArbitrationMatrix";
import { C1Studio } from "./C1Studio";
import { PromptClinic } from "./PromptClinic";
import { TestBench } from "./TestBench";
import { J2CertificationStudio } from "./J2CertificationStudio";
import { PilotRoom } from "./PilotRoom";
import { PitchCoach } from "./PitchCoach";
import { NotebookBonus } from "./NotebookBonus";
import "./styles.css";

const days = [
  {
    id: 1, accent: "violet", icon: Target, kicker: "Fondations & discernement",
    videoId: "HgaWBQqK9xY",
    title: "Comprendre, cadrer et sécuriser les usages IA en RH",
    subtitle: "Passer de l’envie d’utiliser l’IA à une première feuille de route réaliste, éthique et utile.",
    objectives: ["Identifier les opportunités prioritaires dans son périmètre RH", "Distinguer données utilisables, sensibles et interdites", "Formuler un cadre d’expérimentation responsable"],
    resources: [["Support J1 — Matin", "PDF", "/ia-rh-j1-matin.pdf"], ["Support J1 — Après-midi", "PDF", "/ia-rh-j1-apres-midi.pdf"], ["Guide de décision — Données & confidentialité", "PDF"], ["Canevas de cartographie des opportunités", "DOCX"]],
    notebookBonus: {
      title: "Cas pratiques à télécharger pour NotebookLM",
      description: "Une sélection de 6 dossiers documentaires destinés à être importés dans NotebookLM afin de découvrir le fonctionnement d’une base documentaire IA. Ces documents couvrent le RGPD, l’AI Act, des cas pratiques et de la jurisprudence européenne.",
      accessUrl: "https://notebooklm.google/?hl=fr",
      downloads: [
        ["RGPD et IA générative — guide pédagogique pour les entreprises", "PDF", "/notebooklm-rgpd-ia-generative-guide-pedagogique.pdf"],
        ["Principales décisions européennes RGPD pertinentes pour l’IA générative", "PDF", "/notebooklm-decisions-europeennes-rgpd-ia-generative.pdf"],
        ["Comprendre l’AI Act européen pour les professionnels non juristes", "PDF", "/notebooklm-comprendre-ai-act-non-juristes.pdf"],
        ["RGPD vs AI Act — guide comparatif pour formateurs et dirigeants", "PDF", "/notebooklm-rgpd-vs-ai-act-guide-comparatif.pdf"],
        ["50 cas pratiques d’IA générative en entreprise — RGPD et AI Act", "PDF", "/notebooklm-50-cas-pratiques-ia-rgpd-ai-act.pdf"],
        ["Étude de cas — 100 questions", "PDF", "/notebooklm-etude-de-cas-100-questions.pdf"],
        ["4 liens essentiels pour NotebookLM", "MD", "/notebooklm-4-liens-essentiels.md"],
      ],
    },
    apps: [
      ["Cartographe des opportunités RH", "Matin · Observer", "Décrivez deux processus réels : étapes, irritants, données, acteurs et décisions humaines. Formulez une opportunité d’assistance IA pour chacun.", "Livrable : deux cartes comparables en 20–25 minutes.", Target],
      ["Arbitre RH", "Après-midi · Arbitrer", "Comparez les deux opportunités selon huit critères : valeur, faisabilité, données, impact humain, acceptabilité et contrôle.", "Livrable : un choix argumenté, un report explicable et une prochaine étape.", Scale],
      ["Feu tricolore des données", "Après-midi · Sécuriser", "Vérifiez finalité, minimisation, accès, environnement, conservation et validation humaine. Un rouge reste bloquant.", "Livrable : une décision provisoire et ses garde-fous.", ShieldCheck],
      ["Studio C1", "Après-midi · Cadrer & présenter", "Assemblez votre fiche C1, vos mesures, votre périmètre et une trame de pitch de 2 minutes avec retour d’un pair.", "Livrable : une fiche C1 exportable et corrigée.", FileText],
    ],
    quiz: [
      ["Quelle situation relève principalement de l’IA générative ?", ["Relancer automatiquement un manager après sept jours", "Rédiger un premier brouillon d’offre d’emploi", "Enregistrer un candidat dans un ATS", "Déclencher une notification après validation"], 1, "L’IA générative produit ou transforme un contenu. Une relance ou une notification relève plutôt de l’automatisation."],
      ["Quel usage doit rester hors périmètre du cas Novalys ?", ["Structurer un brouillon d’offre", "Signaler une information manquante", "Trier automatiquement les CV et écarter des candidats", "Faciliter la relecture du texte"], 2, "L’IA peut assister, mais la décision concernant une personne doit rester humaine et explicable."],
      ["Pourquoi les participants étudient-ils deux processus RH ?", ["Pour utiliser deux outils différents", "Pour comparer les besoins et éviter de retenir la première intuition", "Pour doubler le volume du dossier", "Pour automatiser les deux processus"], 1, "Un processus sera retenu, l’autre différé ou écarté avec justification."],
      ["Novalys est :", ["Une entreprise cliente d’Axio", "Une entreprise réelle dont les données ont été anonymisées", "Un cas pédagogique fictif utilisé pour apprendre la méthode", "Le projet que tous les participants présenteront à la certification"], 2, "Le dossier de certification doit ensuite s’appuyer sur une situation réelle issue de la pratique du participant."],
      ["Une baseline correspond à :", ["La solution IA choisie", "La valeur initiale mesurée avant le projet", "La cible souhaitée", "La liste des risques"], 1, "Sans mesure de départ, une cible ne permet pas de démontrer une évolution."],
    ],
  },
  {
    id: 2, accent: "blue", icon: WandSparkles, kicker: "Production assistée",
    videoId: "RWGS2MeOCY0",
    title: "Concevoir des contenus RH utiles avec l’IA",
    subtitle: "Transformer une intention RH en contenu clair, inclusif et immédiatement réutilisable.",
    objectives: ["Structurer des prompts professionnels et vérifiables", "Produire et améliorer des contenus RH variés", "Installer un contrôle qualité avant diffusion"],
    resources: [["Support J2 — Prompts & contenus RH", "PPT"], ["Fiche source fictive Novalys — Technicien maintenance", "PDF", "/j2-fiche-source-fictive-novalys-technicien-maintenance.pdf"], ["Bibliothèque de prompts RH", "PDF"], ["Grille de relecture inclusive", "PDF"]],
    notebookBonus: {
      title: "Skill, création vidéo et STT",
      description: "Des documents fictifs pour tester la création d’un skill, puis des ressources bonus autour de la conception de vidéos illustrées et des usages de transcription.",
      downloads: [
        ["Document test — Contrat fictif de Léa", "PDF", "/bonus-j2-contrat-fictif-lea.pdf"],
        ["Document test — Courriel fictif d’arrivée de Léa", "PDF", "/bonus-j2-courriel-arrivee-lea.pdf"],
        ["Document test — Convocation fictive aux formations de Léa", "PDF", "/bonus-j2-convocation-formations-lea.pdf"],
        ["Exemple de skill — concevoir un storyboard de vidéo illustrée", "PDF", "/bonus-j2-exemple-skill-storyboard-video-illustree.pdf"],
        ["Skill IA & RH", "À produire prochainement"],
        ["Création vidéo", "À produire prochainement"],
        ["STT — Speech to text", "À produire prochainement"],
      ],
    },
    apps: [
      ["Prompt Clinic", "Atelier interactif", "Réécrire un prompt flou avec 5 curseurs : rôle, objectif, contexte, contraintes et format de sortie.", "Avant / après pour visualiser le gain de précision.", WandSparkles],
      ["Banc d’essai IA RH", "Simulateur de décision", "Repérer une formulation stéréotypée, une information non vérifiée ou une promesse ambiguë dans un contenu RH fictif.", "Livrable : une décision GO, AJUSTER ou STOP justifiée.", ClipboardCheck],
      ["Studio Certification J2", "Fin de journée · Finaliser", "Rassembler les productions réalisées, vérifier les preuves attendues et mettre en forme le dossier sans inventer de contenu.", "Livrable : dossier J2 complet ou quatre preuves séparées, exportables en PDF.", FileText],
    ],
    quiz: [
      ["Dans quel ordre faut-il construire un projet IA RH ?", ["Outil → besoin → comparaison → scénario", "Besoin → scénario → comparaison → choix conditionnel", "Comparaison → outil → besoin → test", "Prompt → outil → processus → objectif"], 1, "Le problème métier vient avant la solution technique. On ne choisit pas un outil pour chercher ensuite à quoi il pourrait servir."],
      ["Une information importante sur une solution n’est pas disponible ou suffisamment vérifiée. Que faut-il faire ?", ["Utiliser l’estimation la plus probable", "Demander à l’IA de compléter l’information", "Écrire « Information à confirmer », puis identifier la source ou la personne chargée de vérifier", "Supprimer le critère de comparaison"], 2, "Une information manquante ne doit jamais être inventée. Elle devient une question documentée, associée à un responsable et, si possible, à une échéance."],
      ["Quelle est la différence principale entre un prompt de production et un prompt de contrôle ?", ["Le prompt de production est réservé aux RH et le prompt de contrôle aux managers", "Le prompt de production génère un résultat ; le prompt de contrôle recherche les écarts, lacunes et points à vérifier", "Le prompt de contrôle corrige automatiquement toutes les erreurs", "Il n’existe pas de différence réelle"], 1, "Le prompt de production prépare un brouillon. Le prompt de contrôle ne doit pas simplement demander « Est-ce que c’est bon ? » ; il doit analyser selon des critères précis."],
      ["Un verbatim ne contient plus le nom du salarié. Peut-on considérer qu’il est anonymisé et l’utiliser librement ?", ["Oui, retirer le nom suffit", "Oui, s’il est utilisé uniquement pendant quelques minutes", "Non, car un lieu rare, un rôle unique ou une combinaison de détails peuvent permettre la ré-identification", "Oui, si l’IA promet de ne pas conserver le texte"], 2, "Supprimer un identifiant direct ne supprime pas nécessairement le risque. Il peut être préférable de synthétiser, utiliser un cas fictif, exclure la donnée ou demander une validation compétente."],
      ["Quand la décision « AJUSTER » est-elle la plus appropriée ?", ["Lorsque tous les critères sont atteints et que le pilote peut commencer", "Lorsqu’un risque majeur ne peut pas être maîtrisé", "Lorsqu’un écart a été identifié, qu’une correction est possible et qu’un nouveau test est nécessaire", "Lorsque le résultat est satisfaisant une seule fois"], 2, "GO : critères atteints, limites connues et contrôle humain possible. AJUSTER : correction nécessaire, puis nouveau test. STOP : risque, donnée ou prérequis non maîtrisé."],
    ],
  },
  {
    id: 3, accent: "teal", icon: Rocket, kicker: "Piloter & ancrer",
    videoId: "35fVK8xY2F4",
    title: "Tester, mesurer et déployer son projet IA & RH",
    subtitle: "Construire un pilote crédible, embarquer les parties prenantes et mesurer ce qui compte vraiment.",
    objectives: ["Définir un pilote à petite échelle et réversible", "Choisir des indicateurs utiles au métier et aux personnes", "Présenter une feuille de route de déploiement"],
    resources: [["Support J3 — Pilote et déploiement", "PPT"], ["Canevas de pilote IA & RH", "DOCX"], ["Tableau de bord de suivi", "XLSX"]],
    apps: [
      ["Pilot Room", "Simulateur de décision", "Arbitrer les choix d’un pilote selon son périmètre, son bénéfice attendu, ses risques et ses indicateurs de succès.", "Restitution : GO, AJUSTER ou STOP, avec justification.", Activity],
      ["Pitch projet IA & RH", "Coach de pitch", "Préparer un pitch de 90 secondes à partir de cartes : problème, solution, garde-fous, preuve et prochaine étape.", "Une trame prête à présenter au sponsor ou au comité de direction.", BrainCircuit],
    ],
    quiz: [
      ["Un prototype a obtenu de bons résultats lors des premiers tests. Quelle est la prochaine étape la plus responsable ?", ["Le généraliser immédiatement à toute l’organisation", "Le déployer de manière limitée, avec un responsable, une date de revue et une règle d’arrêt", "Supprimer le contrôle humain pour gagner davantage de temps", "Attendre qu’un incident soit signalé avant de définir les règles"], 1, "Un résultat satisfaisant ne justifie pas une généralisation. Le déploiement reste limité, accompagné, mesuré et réversible."],
      ["Quels sont les trois types d’indicateurs à intégrer au dispositif de mesure ?", ["Coût, nombre de prompts et nombre d’utilisateurs", "Efficacité, qualité et relation humaine", "Rapidité, satisfaction du manager et volume produit", "Connexions, erreurs techniques et consommation informatique"], 1, "Efficacité : temps, délai ou volume. Qualité : retouches, erreurs ou incidents. Relation humaine : satisfaction des personnes concernées, escalades, compréhension ou disponibilité du recours humain. La satisfaction du manager ne suffit pas comme indicateur relationnel."],
      ["Un pilote fait gagner 25 % de temps, mais le taux de retouches et les sollicitations adressées aux RH augmentent. Quelle conclusion faut-il privilégier ?", ["Le gain de temps prouve que le projet est réussi", "Il faut généraliser avant que les résultats ne se dégradent", "Il faut analyser les coûts de contrôle, la qualité et la relation avant de décider", "Les retouches ne comptent pas puisqu’elles sont réalisées par des humains"], 2, "Le temps gagné doit inclure le temps de relecture et de correction. Une amélioration apparente peut masquer une baisse de qualité ou une surcharge humaine."],
      ["Une formulation problématique a été transmise à un collaborateur. Quelle doit être la première question du comité de pilotage ?", ["Comment conserver malgré tout le gain de productivité ?", "Qui doit être sanctionné ?", "Que faut-il protéger, suspendre ou corriger avant de poursuivre ?", "Comment éviter de documenter l’incident ?"], 2, "La priorité porte sur les personnes, les données, l’équité et la responsabilité. L’incident doit être tracé, traité, suivi d’une action et d’un nouveau test."],
      ["Quelle affirmation décrit le mieux une soutenance crédible ?", ["Elle montre principalement les fonctionnalités de l’outil", "Elle présente uniquement les gains et évite de parler des limites", "Elle relie chaque affirmation importante à une preuve datée et assume les limites", "Elle transforme les exercices Novalys en résultats réels de l’organisation"], 2, "Le pitch doit présenter le problème réel, le choix réalisé, les risques et garde-fous, les tests, la diffusion, la mesure, les limites et la prochaine décision humaine. Un résultat pédagogique fictif ne devient jamais un résultat réel."],
    ],
  },
];

function App() {
  const [screen, setScreen] = useState("login");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [dayId, setDayId] = useState(1);
  const [answers, setAnswers] = useState({});
  const [videoId, setVideoId] = useState("");
  const [editor, setEditor] = useState(false);
  const [videoValue, setVideoValue] = useState("");
  const day = useMemo(() => days.find((item) => item.id === dayId), [dayId]);
  useEffect(() => {
    if (!day) return;
    setVideoId(localStorage.getItem(`ia-rh-youtube-day-${day.id}`) || day.videoId || "");
  }, [day]);
  const openDay = (id) => { setDayId(id); setScreen("day"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const unlock = (event) => { event.preventDefault(); if (pin === "4321") { setScreen("dashboard"); setError(false); } else { setPin(""); setError(true); } };
  const saveVideo = () => { const id = youtubeId(videoValue); if (!id || !day) return; localStorage.setItem(`ia-rh-youtube-day-${day.id}`, id); setVideoId(id); setVideoValue(""); setEditor(false); };
  if (screen === "login") return <Login pin={pin} setPin={setPin} error={error} unlock={unlock} />;
  if (screen === "dashboard") return <Dashboard openDay={openDay} />;
  if (screen === "cartographer") return <Cartographer back={() => setScreen("day")} />;
  if (screen === "arbitration-matrix") return <ArbitrationMatrix back={() => setScreen("day")} />;
  if (screen === "traffic-light") return <DataTrafficLight back={() => setScreen("day")} />;
  if (screen === "c1-studio") return <C1Studio back={() => setScreen("day")} />;
  if (screen === "prompt-clinic") return <PromptClinic back={() => setScreen("day")} />;
  if (screen === "test-bench") return <TestBench back={() => setScreen("day")} />;
  if (screen === "j2-certification-studio") return <J2CertificationStudio back={() => setScreen("day")} />;
  if (screen === "pilot-room") return <PilotRoom back={() => setScreen("day")} />;
  if (screen === "pitch-coach") return <PitchCoach back={() => setScreen("day")} />;
  return <DayPage day={day} answers={answers} setAnswers={setAnswers} back={() => setScreen("dashboard")} openDay={openDay} openCartographer={() => setScreen("cartographer")} openArbitrationMatrix={() => setScreen("arbitration-matrix")} openTrafficLight={() => setScreen("traffic-light")} openC1Studio={() => setScreen("c1-studio")} openPromptClinic={() => setScreen("prompt-clinic")} openTestBench={() => setScreen("test-bench")} openJ2CertificationStudio={() => setScreen("j2-certification-studio")} openPilotRoom={() => setScreen("pilot-room")} openPitchCoach={() => setScreen("pitch-coach")} videoId={videoId} edit={() => setEditor(true)} editor={editor} close={() => setEditor(false)} videoValue={videoValue} setVideoValue={setVideoValue} saveVideo={saveVideo} />;
}

function Login({ pin, setPin, error, unlock }) {
  return <main className="login-shell"><i className="ambient one" /><i className="ambient two" /><section className="login-card"><div className="brand-mark large"><BrainCircuit size={30} /></div><p className="eyebrow">ESPACE APPRENANT</p><h1>IA &amp; RH</h1><p className="login-copy">Votre parcours pour expérimenter l’IA avec méthode, discernement et impact.</p><form onSubmit={unlock}><label><LockKeyhole size={16} /> Code d’accès</label><input aria-label="Code d’accès" inputMode="numeric" autoComplete="one-time-code" type="password" maxLength="4" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(false); }} placeholder="••••" />{error && <p className="error">Le code saisi n’est pas reconnu.</p>}<button className="primary" type="submit"><KeyRound size={18} /> Accéder à mon parcours</button></form><p className="security"><ShieldCheck size={14} /> Accès réservé aux participants de la formation</p></section></main>;
}

function Header({ home, profile = true }) { return <header className="topbar"><div className="topbar-inner"><button className="brand" onClick={home}><span className="brand-mark">IA</span><span>IA &amp; RH <small>Espace apprenant</small></span></button>{profile && <div className="profile"><UserRound size={17} /><span><b>Participant</b><small>Parcours certifiant</small></span><BadgeCheck size={18} /></div>}</div></header>; }

function Dashboard({ openDay }) {
  return <main className="shell"><Header home={() => {}} /><section className="dashboard-hero page"><div><p className="eyebrow">PARCOURS CERTIFIANT · IA &amp; RESSOURCES HUMAINES</p><h1>Apprendre, expérimenter,<br /><span>faire évoluer ses pratiques.</span></h1><p>Trois journées pour passer des fondamentaux à un projet IA &amp; RH concret, responsable et mesurable.</p></div><div className="progress"><i /> Jour 1 <b /> <i /> Jour 2 <b /> <i /> Jour 3</div></section><section className="day-grid page">{days.map((day) => { const Icon = day.icon; return <article className={`day-card ${day.accent}`} key={day.id}><div className="card-top"><span className="icon-square"><Icon size={24} /></span><em>JOUR {day.id}</em></div><p className="card-kicker">{day.kicker}</p><h2>{day.title}</h2><p className="card-copy">{day.subtitle}</p><footer><span><Clock3 size={15} /> 7 h · Classe virtuelle</span><button onClick={() => openDay(day.id)}>Ouvrir <ChevronRight size={17} /></button></footer></article>; })}</section><section className="how page"><div><Sparkles size={21} /><strong>Un espace conçu pour la mise en pratique</strong></div><p>Vidéos d’introduction, supports, quiz, jeux courts et applications métier : chaque activité prépare le transfert dans votre quotidien RH.</p></section></main>;
}

function DayPage({ day, answers, setAnswers, back, openDay, openCartographer, openArbitrationMatrix, openTrafficLight, openC1Studio, openPromptClinic, openTestBench, openJ2CertificationStudio, openPilotRoom, openPitchCoach, videoId, edit, editor, close, videoValue, setVideoValue, saveVideo }) {
  const Icon = day.icon; const next = days[day.id]; const solved = day.quiz.filter((item, index) => answers[`${day.id}-${index}`] === item[2]).length;
  return <main className="shell"><Header home={back} /><div className="back page"><button onClick={back}><ArrowLeft size={17} /> Retour au parcours</button><span>Jour {day.id} sur 3</span></div><section className={`hero ${day.accent} page`}><span className="hero-icon"><Icon size={27} /></span><div><p className="eyebrow">JOUR {day.id} · {day.kicker}</p><h1>{day.title}</h1><p>{day.subtitle}</p></div><span className="duration"><Clock3 size={16} /> 7 h · Classe virtuelle</span></section><section className="content page"><div className="main"><SectionTitle color="red" icon={Film} title="Vidéo d’introduction" text="5 à 8 minutes pour lancer la journée" /><Video videoId={videoId} edit={edit} /><SectionTitle color="blue" icon={ClipboardCheck} title="Défi de la journée" text="Validez les repères essentiels avant de passer à l’activité suivante." spaced /><Quiz day={day} answers={answers} setAnswers={setAnswers} /><SectionTitle color="green" icon={Sparkles} title="Laboratoire d’applications" text={day.id === 1 ? "Suivez le parcours : observer, arbitrer, sécuriser, cadrer et présenter." : day.id === 2 ? "Produisez, testez, puis assemblez vos preuves dans le Studio Certification en fin de journée." : "Propositions de développements à intégrer à votre animation."} spaced /><div className="apps">{day.apps.map(([name, type, copy, impact, AppIcon]) => <article className="app-card" key={name}><span><AppIcon size={20} /></span><div><em>{type}</em><h3>{name}</h3><p>{copy}</p><footer><CheckCircle2 size={15} /> {impact}</footer>{day.id === 1 && name === "Cartographe des opportunités RH" && <button className="launch-app" onClick={openCartographer}>Créer mes deux cartes <ArrowRight size={15} /></button>}{day.id === 1 && name === "Arbitre RH" && <button className="launch-app" onClick={openArbitrationMatrix}>Comparer mes opportunités <ArrowRight size={15} /></button>}{day.id === 1 && name === "Feu tricolore des données" && <button className="launch-app" onClick={openTrafficLight}>Sécuriser le périmètre <ArrowRight size={15} /></button>}{day.id === 1 && name === "Studio C1" && <button className="launch-app" onClick={openC1Studio}>Finaliser ma fiche C1 <ArrowRight size={15} /></button>}{day.id === 2 && name === "Prompt Clinic" && <button className="launch-app" onClick={openPromptClinic}>Ouvrir l’atelier <ArrowRight size={15} /></button>}{day.id === 2 && name === "Banc d’essai IA RH" && <button className="launch-app" onClick={openTestBench}>Lancer le banc d’essai <ArrowRight size={15} /></button>}{day.id === 2 && name === "Studio Certification J2" && <button className="launch-app" onClick={openJ2CertificationStudio}>Finaliser mon dossier J2 <ArrowRight size={15} /></button>}{day.id === 3 && name === "Pilot Room" && <button className="launch-app" onClick={openPilotRoom}>Ouvrir le pilote <ArrowRight size={15} /></button>}{day.id === 3 && name === "Pitch projet IA & RH" && <button className="launch-app" onClick={openPitchCoach}>Préparer mon pitch <ArrowRight size={15} /></button>}</div></article>)}</div><section className="objectives"><div><Target size={20} /><h3>À l’issue de cette journée</h3></div><ul>{day.objectives.map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></section>{next && <button className="next" onClick={() => openDay(next.id)}><span>Prochaine étape</span><b>Découvrir le jour {next.id}</b><ArrowRight size={20} /></button>}</div><aside><Resources items={day.resources} />{day.notebookBonus && <NotebookBonus bonus={day.notebookBonus} />}<section className="score"><div><BadgeCheck size={20} /> <span>Repères validés</span></div><strong>{solved}<small> / {day.quiz.length}</small></strong><p>Le score s’actualise au fil du défi.</p></section><section className="tip"><BrainCircuit size={21} /><h3>Le bon réflexe</h3><p>{day.id === 1 ? "Observez les deux processus avant de les arbitrer : le score ne remplace jamais le jugement RH." : day.id === 2 ? "Le Studio met vos productions en forme : il ne crée ni vos preuves, ni votre décision." : "Utilisez l’IA comme un partenaire de travail : formulez, vérifiez, adaptez."}</p></section></aside></section>{editor && <Modal value={videoValue} setValue={setVideoValue} save={saveVideo} close={close} />}</main>;
}

function SectionTitle({ icon: Icon, title, text, color, spaced }) { return <div className={`section-title ${spaced ? "spaced" : ""}`}><span className={color}><Icon size={19} /></span><div><h2>{title}</h2><p>{text}</p></div></div>; }
function Video({ videoId, edit }) { return videoId ? <div className="video"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title="Vidéo d’introduction" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /><button onClick={edit}>Modifier la vidéo</button></div> : <div className="video placeholder"><i /><div><span><Play fill="currentColor" size={21} /></span><p className="eyebrow">EMPLACEMENT YOUTUBE</p><h3>Ajoutez la vidéo d’introduction</h3><p>Collez simplement l’URL YouTube de la vidéo de cette journée.</p><button onClick={edit}><Film size={17} /> Configurer la vidéo</button></div></div>; }
function Resources({ items }) { return <section className="resources"><SectionTitle color="purple" icon={BookOpen} title="Ressources" />{items.map(([name, type, href, behavior]) => {
  const external = behavior === "external";
  const content = <><span><FileText size={18} /></span><div><b>{name}</b><small>{type} · {href ? external ? "Ouvrir" : "Télécharger" : "À déposer"}</small></div>{href ? external ? <ExternalLink size={17} /> : <FileDown size={17} /> : <ChevronRight size={17} />}</>;
  return href ? <a className="resource" key={name} href={href} download={external ? undefined : true} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{content}</a> : <button className="resource" key={name}>{content}</button>;
})}</section>; }
function Quiz({ day, answers, setAnswers }) { const [index, setIndex] = useState(0); const [question, choices, answer, explanation] = day.quiz[index]; const key = `${day.id}-${index}`; const selected = answers[key]; const answered = selected !== undefined; return <section className="quiz"><div className="quiz-top"><span>Question {index + 1} / {day.quiz.length}</span><i><b style={{ width: `${((index + 1) / day.quiz.length) * 100}%` }} /></i></div><h3>{question}</h3><div className="answers">{choices.map((choice, choiceIndex) => { const state = answered ? choiceIndex === answer ? "correct" : choiceIndex === selected ? "incorrect" : "" : ""; return <button className={state} disabled={answered} onClick={() => setAnswers({ ...answers, [key]: choiceIndex })} key={choice}><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}{answered && choiceIndex === answer && <CheckCircle2 size={18} />}</button>; })}</div>{answered && <p className={`feedback ${selected === answer ? "success" : "retry"}`}><b>{selected === answer ? "Bien vu !" : "À retenir"}</b>{explanation}</p>}<footer><button className="link" onClick={() => { setAnswers({}); setIndex(0); }}>Réinitialiser</button><button className="secondary" disabled={!answered || index === day.quiz.length - 1} onClick={() => setIndex(index + 1)}>Question suivante <ArrowRight size={17} /></button></footer></section>; }
function Modal({ value, setValue, save, close }) { return <div className="modal-layer" role="dialog" aria-modal="true"><section className="modal"><button className="close" onClick={close} aria-label="Fermer"><X size={20} /></button><span className="red"><Film size={19} /></span><h2>Ajouter une vidéo YouTube</h2><p>Collez une URL YouTube (youtube.com ou youtu.be). Elle sera enregistrée dans ce navigateur.</p><label htmlFor="youtube">Lien de la vidéo</label><input id="youtube" autoFocus placeholder="https://www.youtube.com/watch?v=…" value={value} onChange={(e) => setValue(e.target.value)} /><button className="primary compact" onClick={save}><Play size={17} /> Enregistrer la vidéo</button></section></div>; }
function youtubeId(value) { const match = value.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/); return match ? match[1] : ""; }
createRoot(document.getElementById("root")).render(<App />);
