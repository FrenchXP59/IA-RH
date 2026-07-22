import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, ArrowLeft, ArrowRight, BadgeCheck, BookOpen, BrainCircuit,
  CheckCircle2, ChevronRight, ClipboardCheck, Clock3, FileText, Film,
  KeyRound, LockKeyhole, Play, Rocket, ShieldCheck, Sparkles, Target,
  UserRound, WandSparkles, X,
} from "lucide-react";
import { Cartographer } from "./Cartographer";
import "./styles.css";

const days = [
  {
    id: 1, accent: "violet", icon: Target, kicker: "Fondations & discernement",
    title: "Comprendre, cadrer et sécuriser les usages IA en RH",
    subtitle: "Passer de l’envie d’utiliser l’IA à une première feuille de route réaliste, éthique et utile.",
    objectives: ["Identifier les opportunités prioritaires dans son périmètre RH", "Distinguer données utilisables, sensibles et interdites", "Formuler un cadre d’expérimentation responsable"],
    resources: [["Support J1 — Fondations IA & RH", "PPT"], ["Guide de décision — Données & confidentialité", "PDF"], ["Canevas de cartographie des opportunités", "DOCX"]],
    apps: [
      ["Cartographe des opportunités RH", "Application guidée", "Un parcours de priorisation en 5 minutes : processus, irritant, bénéfice attendu, données mobilisées et garde-fous.", "Livrable : une idée d’usage prête à être instruite.", Target],
      ["Feu tricolore des données", "Speed game", "Classer 12 situations RH en vert, orange ou rouge pour apprendre à repérer le risque avant de prompter.", "Débrief immédiat sur confidentialité, biais et validation humaine.", ShieldCheck],
    ],
    quiz: [
      ["Quel est le premier réflexe avant d’utiliser une IA sur un processus RH ?", ["Vérifier l’objectif, les données et le niveau de risque", "Copier l’intégralité du dossier salarié dans le chat", "Choisir l’outil qui produit la réponse la plus longue"], 0, "Un usage RH commence par le besoin métier et un contrôle des données, pas par l’outil."],
      ["Quel rôle doit conserver le professionnel RH ?", ["La décision et la validation finale", "Aucun : l’IA décide seule", "Seulement la mise en forme des résultats"], 0, "L’IA assiste l’analyse ; la responsabilité et l’arbitrage restent humains."],
      ["Une donnée personnelle sensible doit être…", ["Anonymisée ou exclue selon le cas d’usage", "Toujours intégrée car elle rend l’IA plus précise", "Partagée avec tous les outils gratuits"], 0, "La minimisation et l’anonymisation protègent les personnes comme l’organisation."],
    ],
  },
  {
    id: 2, accent: "blue", icon: WandSparkles, kicker: "Production assistée",
    title: "Concevoir des contenus RH utiles avec l’IA",
    subtitle: "Transformer une intention RH en contenu clair, inclusif et immédiatement réutilisable.",
    objectives: ["Structurer des prompts professionnels et vérifiables", "Produire et améliorer des contenus RH variés", "Installer un contrôle qualité avant diffusion"],
    resources: [["Support J2 — Prompts & contenus RH", "PPT"], ["Bibliothèque de prompts RH", "PDF"], ["Grille de relecture inclusive", "PDF"]],
    apps: [
      ["Prompt Clinic", "Atelier interactif", "Réécrire un prompt flou avec 5 curseurs : rôle, objectif, contexte, contraintes et format de sortie.", "Avant / après pour visualiser le gain de précision.", WandSparkles],
      ["Laboratoire de relecture RH", "Scénario à embranchements", "Repérer une formulation stéréotypée, une information non vérifiée ou une promesse ambiguë dans une offre ou un mail.", "Score qualité : précision, inclusion, confidentialité et ton.", ClipboardCheck],
    ],
    quiz: [
      ["Quel élément rend un prompt RH réellement exploitable ?", ["Un objectif et un format de sortie explicites", "Le plus grand nombre possible de mots-clés", "Une consigne sans contexte pour aller plus vite"], 0, "Le contexte, le public attendu et le format rendent une production vérifiable et actionnable."],
      ["Avant de publier un contenu généré, il faut…", ["Le relire, le vérifier et l’adapter au contexte", "Le diffuser tel quel car l’IA a été entraînée", "Supprimer toute mention du contrôle humain"], 0, "Une IA peut inventer, omettre ou reproduire des biais : la relecture métier est indispensable."],
      ["Pour une annonce de recrutement, un bon critère de qualité est…", ["L’inclusivité et la clarté des compétences attendues", "La multiplication des superlatifs", "L’absence de toute information sur le poste"], 0, "Un contenu RH efficace est clair, factuel et accessible à des profils variés."],
    ],
  },
  {
    id: 3, accent: "teal", icon: Rocket, kicker: "Piloter & ancrer",
    title: "Tester, mesurer et déployer son projet IA & RH",
    subtitle: "Construire un pilote crédible, embarquer les parties prenantes et mesurer ce qui compte vraiment.",
    objectives: ["Définir un pilote à petite échelle et réversible", "Choisir des indicateurs utiles au métier et aux personnes", "Présenter une feuille de route de déploiement"],
    resources: [["Support J3 — Pilote et déploiement", "PPT"], ["Canevas de pilote IA & RH", "DOCX"], ["Tableau de bord de suivi", "XLSX"]],
    apps: [
      ["Pilot Room", "Simulateur de décision", "Arbitrer les choix d’un pilote selon son périmètre, son bénéfice attendu, ses risques et ses indicateurs de succès.", "Restitution : GO, AJUSTER ou STOP, avec justification.", Activity],
      ["Pitch projet IA & RH", "Coach de pitch", "Préparer un pitch de 90 secondes à partir de cartes : problème, solution, garde-fous, preuve et prochaine étape.", "Une trame prête à présenter au sponsor ou au comité de direction.", BrainCircuit],
    ],
    quiz: [
      ["Un premier pilote IA & RH doit être…", ["Limité, mesurable et réversible", "Déployé à tous les collaborateurs en une semaine", "Évalué uniquement sur le nombre de contenus produits"], 0, "Un pilote réduit l’incertitude et donne des éléments factuels avant un déploiement."],
      ["Quel indicateur complète utilement le gain de temps ?", ["La qualité perçue et le taux de correction humaine", "La longueur des prompts utilisés", "Le nombre de comptes créés sans les utiliser"], 0, "La performance doit associer efficacité, qualité et conditions d’appropriation."],
      ["Pour embarquer les équipes, il est préférable de…", ["Partager les règles, les limites et les retours d’expérience", "Imposer l’outil sans explication", "Cacher les cas d’erreur observés pendant le pilote"], 0, "La transparence et la co-construction favorisent la confiance et l’adoption."],
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
  useEffect(() => setVideoId(localStorage.getItem("ia-rh-youtube") || ""), []);
  const day = useMemo(() => days.find((item) => item.id === dayId), [dayId]);
  const openDay = (id) => { setDayId(id); setScreen("day"); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const unlock = (event) => { event.preventDefault(); if (pin === "4321") { setScreen("dashboard"); setError(false); } else { setPin(""); setError(true); } };
  const saveVideo = () => { const id = youtubeId(videoValue); if (!id) return; localStorage.setItem("ia-rh-youtube", id); setVideoId(id); setVideoValue(""); setEditor(false); };
  if (screen === "login") return <Login pin={pin} setPin={setPin} error={error} unlock={unlock} />;
  if (screen === "dashboard") return <Dashboard openDay={openDay} />;
  if (screen === "cartographer") return <Cartographer back={() => setScreen("day")} />;
  return <DayPage day={day} answers={answers} setAnswers={setAnswers} back={() => setScreen("dashboard")} openDay={openDay} openCartographer={() => setScreen("cartographer")} videoId={videoId} edit={() => setEditor(true)} editor={editor} close={() => setEditor(false)} videoValue={videoValue} setVideoValue={setVideoValue} saveVideo={saveVideo} />;
}

function Login({ pin, setPin, error, unlock }) {
  return <main className="login-shell"><i className="ambient one" /><i className="ambient two" /><section className="login-card"><div className="brand-mark large"><BrainCircuit size={30} /></div><p className="eyebrow">ESPACE APPRENANT</p><h1>IA &amp; RH</h1><p className="login-copy">Votre parcours pour expérimenter l’IA avec méthode, discernement et impact.</p><form onSubmit={unlock}><label><LockKeyhole size={16} /> Code d’accès</label><input aria-label="Code d’accès" inputMode="numeric" autoComplete="one-time-code" type="password" maxLength="4" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(false); }} placeholder="••••" />{error && <p className="error">Le code saisi n’est pas reconnu.</p>}<button className="primary" type="submit"><KeyRound size={18} /> Accéder à mon parcours</button></form><p className="security"><ShieldCheck size={14} /> Accès réservé aux participants de la formation</p></section></main>;
}

function Header({ home, profile = true }) { return <header className="topbar"><div className="topbar-inner"><button className="brand" onClick={home}><span className="brand-mark">IA</span><span>IA &amp; RH <small>Espace apprenant</small></span></button>{profile && <div className="profile"><UserRound size={17} /><span><b>Participant</b><small>Parcours certifiant</small></span><BadgeCheck size={18} /></div>}</div></header>; }

function Dashboard({ openDay }) {
  return <main className="shell"><Header home={() => {}} /><section className="dashboard-hero page"><div><p className="eyebrow">PARCOURS CERTIFIANT · IA &amp; RESSOURCES HUMAINES</p><h1>Apprendre, expérimenter,<br /><span>faire évoluer ses pratiques.</span></h1><p>Trois journées pour passer des fondamentaux à un projet IA &amp; RH concret, responsable et mesurable.</p></div><div className="progress"><i /> Jour 1 <b /> <i /> Jour 2 <b /> <i /> Jour 3</div></section><section className="day-grid page">{days.map((day) => { const Icon = day.icon; return <article className={`day-card ${day.accent}`} key={day.id}><div className="card-top"><span className="icon-square"><Icon size={24} /></span><em>JOUR {day.id}</em></div><p className="card-kicker">{day.kicker}</p><h2>{day.title}</h2><p className="card-copy">{day.subtitle}</p><footer><span><Clock3 size={15} /> 7 h · Classe virtuelle</span><button onClick={() => openDay(day.id)}>Ouvrir <ChevronRight size={17} /></button></footer></article>; })}</section><section className="how page"><div><Sparkles size={21} /><strong>Un espace conçu pour la mise en pratique</strong></div><p>Vidéos d’introduction, supports, quiz, jeux courts et applications métier : chaque activité prépare le transfert dans votre quotidien RH.</p></section></main>;
}

function DayPage({ day, answers, setAnswers, back, openDay, openCartographer, videoId, edit, editor, close, videoValue, setVideoValue, saveVideo }) {
  const Icon = day.icon; const next = days[day.id]; const solved = day.quiz.filter((item, index) => answers[`${day.id}-${index}`] === item[2]).length;
  return <main className="shell"><Header home={back} /><div className="back page"><button onClick={back}><ArrowLeft size={17} /> Retour au parcours</button><span>Jour {day.id} sur 3</span></div><section className={`hero ${day.accent} page`}><span className="hero-icon"><Icon size={27} /></span><div><p className="eyebrow">JOUR {day.id} · {day.kicker}</p><h1>{day.title}</h1><p>{day.subtitle}</p></div><span className="duration"><Clock3 size={16} /> 7 h · Classe virtuelle</span></section><section className="content page"><div className="main"><SectionTitle color="red" icon={Film} title="Vidéo d’introduction" text="5 à 8 minutes pour lancer la journée" /><Video videoId={videoId} edit={edit} /><SectionTitle color="blue" icon={ClipboardCheck} title="Défi de la journée" text="Validez les repères essentiels avant de passer à l’activité suivante." spaced /><Quiz day={day} answers={answers} setAnswers={setAnswers} /><SectionTitle color="green" icon={Sparkles} title="Laboratoire d’applications" text="Propositions de développements à intégrer à votre animation." spaced /><div className="apps">{day.apps.map(([name, type, copy, impact, AppIcon]) => <article className="app-card" key={name}><span><AppIcon size={20} /></span><div><em>{type}</em><h3>{name}</h3><p>{copy}</p><footer><CheckCircle2 size={15} /> {impact}</footer>{day.id === 1 && name === "Cartographe des opportunités RH" && <button className="launch-app" onClick={openCartographer}>Lancer le cartographe <ArrowRight size={15} /></button>}</div></article>)}</div><section className="objectives"><div><Target size={20} /><h3>À l’issue de cette journée</h3></div><ul>{day.objectives.map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></section>{next && <button className="next" onClick={() => openDay(next.id)}><span>Prochaine étape</span><b>Découvrir le jour {next.id}</b><ArrowRight size={20} /></button>}</div><aside><Resources items={day.resources} /><section className="score"><div><BadgeCheck size={20} /> <span>Repères validés</span></div><strong>{solved}<small> / {day.quiz.length}</small></strong><p>Le score s’actualise au fil du défi.</p></section><section className="tip"><BrainCircuit size={21} /><h3>Le bon réflexe</h3><p>Utilisez l’IA comme un partenaire de travail : formulez, vérifiez, adaptez.</p></section></aside></section>{editor && <Modal value={videoValue} setValue={setVideoValue} save={saveVideo} close={close} />}</main>;
}

function SectionTitle({ icon: Icon, title, text, color, spaced }) { return <div className={`section-title ${spaced ? "spaced" : ""}`}><span className={color}><Icon size={19} /></span><div><h2>{title}</h2><p>{text}</p></div></div>; }
function Video({ videoId, edit }) { return videoId ? <div className="video"><iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title="Vidéo d’introduction" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /><button onClick={edit}>Modifier la vidéo</button></div> : <div className="video placeholder"><i /><div><span><Play fill="currentColor" size={21} /></span><p className="eyebrow">EMPLACEMENT YOUTUBE</p><h3>Ajoutez la vidéo d’introduction</h3><p>Collez simplement l’URL YouTube de la vidéo de cette journée.</p><button onClick={edit}><Film size={17} /> Configurer la vidéo</button></div></div>; }
function Resources({ items }) { return <section className="resources"><SectionTitle color="purple" icon={BookOpen} title="Ressources" />{items.map(([name, type]) => <button className="resource" key={name}><span><FileText size={18} /></span><div><b>{name}</b><small>{type} · À déposer</small></div><ChevronRight size={17} /></button>)}</section>; }
function Quiz({ day, answers, setAnswers }) { const [index, setIndex] = useState(0); const [question, choices, answer, explanation] = day.quiz[index]; const key = `${day.id}-${index}`; const selected = answers[key]; const answered = selected !== undefined; return <section className="quiz"><div className="quiz-top"><span>Question {index + 1} / {day.quiz.length}</span><i><b style={{ width: `${((index + 1) / day.quiz.length) * 100}%` }} /></i></div><h3>{question}</h3><div className="answers">{choices.map((choice, choiceIndex) => { const state = answered ? choiceIndex === answer ? "correct" : choiceIndex === selected ? "incorrect" : "" : ""; return <button className={state} disabled={answered} onClick={() => setAnswers({ ...answers, [key]: choiceIndex })} key={choice}><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}{answered && choiceIndex === answer && <CheckCircle2 size={18} />}</button>; })}</div>{answered && <p className={`feedback ${selected === answer ? "success" : "retry"}`}><b>{selected === answer ? "Bien vu !" : "À retenir"}</b>{explanation}</p>}<footer><button className="link" onClick={() => { setAnswers({}); setIndex(0); }}>Réinitialiser</button><button className="secondary" disabled={!answered || index === day.quiz.length - 1} onClick={() => setIndex(index + 1)}>Question suivante <ArrowRight size={17} /></button></footer></section>; }
function Modal({ value, setValue, save, close }) { return <div className="modal-layer" role="dialog" aria-modal="true"><section className="modal"><button className="close" onClick={close} aria-label="Fermer"><X size={20} /></button><span className="red"><Film size={19} /></span><h2>Ajouter une vidéo YouTube</h2><p>Collez une URL YouTube (youtube.com ou youtu.be). Elle sera enregistrée dans ce navigateur.</p><label htmlFor="youtube">Lien de la vidéo</label><input id="youtube" autoFocus placeholder="https://www.youtube.com/watch?v=…" value={value} onChange={(e) => setValue(e.target.value)} /><button className="primary compact" onClick={save}><Play size={17} /> Enregistrer la vidéo</button></section></div>; }
function youtubeId(value) { const match = value.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/); return match ? match[1] : ""; }
createRoot(document.getElementById("root")).render(<App />);
