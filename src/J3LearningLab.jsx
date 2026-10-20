import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BarChart3, BookOpen, CheckCircle2, ChevronLeft,
  ChevronRight, CircleHelp, Lightbulb, MessageCircle, RefreshCw, Rocket,
  ShieldCheck, Sparkles, Users,
} from "lucide-react";
import "./J3LearningLab.css";

const STORAGE_KEY = "ia-rh-j3-learning-lab";

const chapters = [
  {
    title: "Le pilote IA & RH",
    subtitle: "Passer d’une bonne idée à une expérimentation réellement maîtrisée.",
    kicker: "CHAPITRE 1 · ENVIRON 12 MIN",
    icon: Rocket,
    color: "coral",
    takeaway: "Un pilote est une expérimentation limitée, mesurée et réversible.",
    cards: [
      {
        label: "À comprendre",
        title: "Prototype, test et pilote ne désignent pas la même chose.",
        text: "Le prototype vérifie qu’une idée est réalisable. Le test observe un résultat dans des conditions définies. Le pilote introduit l’usage sur un périmètre limité, avec des mesures, une personne responsable et une possibilité d’arrêt.",
      },
      {
        label: "Le repère concret",
        title: "Un pilote répond à cinq questions simples.",
        text: "Quel usage ? Pour qui ? Pendant combien de temps ? Qui le suit ? À quelle condition l’arrête-t-on ou l’ajuste-t-on ? Sans ces réponses, on parle plutôt d’un essai informel que d’un pilote.",
      },
    ],
    questions: [
      {
        prompt: "Une équipe RH obtient deux résultats satisfaisants avec un outil qui prépare des brouillons de synthèse. Quelle est la meilleure prochaine étape ?",
        choices: [
          "Le déployer immédiatement à tous les managers.",
          "Le tester six semaines avec deux HRBP, sans décision automatisée, avec une revue finale.",
          "Laisser chaque manager décider librement de son utilisation.",
        ],
        answer: 1,
        explanation: "Ce choix rend l’expérimentation délimitée, mesurable et réversible. Il précise les utilisateurs, la durée, le contrôle humain et le moment de décision.",
      },
      {
        prompt: "Quelle formulation décrit le mieux une règle d’arrêt ?",
        choices: [
          "Nous arrêterons si les retours ne sont pas bons.",
          "Nous déciderons plus tard, selon notre ressenti.",
          "Nous suspendrons le pilote si une donnée non autorisée est utilisée ou si le contrôle humain ne peut plus être assuré.",
        ],
        answer: 2,
        explanation: "Une règle d’arrêt doit être concrète et actionnable. Elle protège les personnes et évite de poursuivre un pilote lorsqu’un prérequis n’est plus maîtrisé.",
      },
    ],
    exchange: "Dans votre projet, quelle limite de population, de durée ou de périmètre rendrait le pilote réellement réversible ?",
  },
  {
    title: "Les indicateurs",
    subtitle: "Mesurer ce qui compte, sans confondre vitesse et réussite.",
    kicker: "CHAPITRE 2 · ENVIRON 12 MIN",
    icon: BarChart3,
    color: "green",
    takeaway: "Un gain de temps seul ne permet jamais de conclure que le projet est réussi.",
    cards: [
      {
        label: "À comprendre",
        title: "Un bon dispositif de mesure croise trois regards.",
        text: "L’efficacité regarde le temps, le délai ou le volume. La qualité regarde les retouches, erreurs ou incidents. La relation humaine regarde la compréhension, la satisfaction des personnes concernées, les escalades et l’accès à une aide humaine.",
      },
      {
        label: "Le repère concret",
        title: "Une baseline est le point de départ, pas la cible.",
        text: "Avant de comparer un résultat, il faut connaître la situation initiale ou planifier honnêtement comment la collecter. Une mesure inconnue doit rester « à collecter » : elle ne se devine pas.",
      },
    ],
    questions: [
      {
        prompt: "Le pilote fait gagner 25 % de temps, mais le taux de retouches et les sollicitations adressées aux RH augmentent. Quelle conclusion est la plus juste ?",
        choices: [
          "Le gain de temps prouve que le pilote doit être généralisé.",
          "Les retouches ne comptent pas puisqu’elles sont faites par des humains.",
          "Il faut analyser ensemble le temps, la qualité et l’effet sur les personnes avant de décider.",
        ],
        answer: 2,
        explanation: "Le temps gagné doit intégrer le temps de relecture et de correction. Une amélioration apparente peut masquer une baisse de qualité ou une surcharge humaine.",
      },
      {
        prompt: "Parmi ces indicateurs, lequel renseigne le mieux la relation humaine ?",
        choices: [
          "Le délai moyen de production du document.",
          "Le nombre de demandes d’aide ou de recours humain exprimées par les personnes concernées.",
          "Le nombre de comptes créés dans l’outil.",
        ],
        answer: 1,
        explanation: "La relation humaine concerne notamment la compréhension, le vécu des personnes et la disponibilité du recours humain. Les connexions ou le délai ne suffisent pas à la mesurer.",
      },
    ],
    exchange: "Quel indicateur d’efficacité, de qualité et de relation humaine pourriez-vous suivre dans votre propre pilote ?",
  },
  {
    title: "La conduite du changement",
    subtitle: "Préparer les personnes, expliquer les limites et maintenir un recours humain.",
    kicker: "CHAPITRE 3 · ENVIRON 12 MIN",
    icon: Users,
    color: "blue",
    takeaway: "Présenter l’IA sans surpromesse est une condition de confiance.",
    cards: [
      {
        label: "À comprendre",
        title: "Un projet IA modifie souvent le travail avant de modifier l’outil.",
        text: "Il faut identifier les personnes impactées, celles qui utilisent l’outil, celles qui valident le résultat et celles qui peuvent demander une aide humaine ou contester une information. Elles n’ont pas toutes le même besoin d’information.",
      },
      {
        label: "Le repère concret",
        title: "Expliquer l’usage, les limites et la responsabilité.",
        text: "Une communication utile indique ce que l’outil prépare, ce qu’il ne décide pas, qui relit ou valide, et comment signaler une erreur. Elle ne promet ni neutralité automatique ni suppression du rôle humain.",
      },
    ],
    questions: [
      {
        prompt: "Un manager souhaite lancer l’outil « discrètement » pour ne pas créer de questions. Quelle réponse est la plus responsable ?",
        choices: [
          "Accepter : moins les personnes savent, plus le pilote est objectif.",
          "Identifier les personnes concernées, expliquer l’usage et les limites, puis organiser un point de contact humain.",
          "Informer uniquement l’équipe informatique, puisque l’usage concerne un outil.",
        ],
        answer: 1,
        explanation: "Les personnes concernées doivent pouvoir comprendre l’usage qui les impacte et savoir vers qui se tourner. Cela nourrit la confiance et permet de détecter des effets non prévus.",
      },
      {
        prompt: "Quelle formulation est la plus adaptée pour présenter un assistant IA RH ?",
        choices: [
          "L’IA garantit des décisions plus justes que les humains.",
          "L’outil prépare un brouillon ; une personne identifiée en vérifie le contenu avant toute utilisation.",
          "L’IA prendra progressivement le relais des managers.",
        ],
        answer: 1,
        explanation: "Cette formulation est claire, réaliste et rappelle le contrôle humain. Elle évite de promettre ce qu’un outil ne peut pas garantir.",
      },
    ],
    exchange: "Qui doit être informé, accompagné ou pouvoir demander une aide humaine dans votre projet ?",
  },
  {
    title: "La gouvernance légère",
    subtitle: "Organiser une décision humaine sans créer une usine à gaz.",
    kicker: "CHAPITRE 4 · ENVIRON 12 MIN",
    icon: ShieldCheck,
    color: "violet",
    takeaway: "Un pilote responsable a un responsable métier, une date de revue et une décision attendue.",
    cards: [
      {
        label: "À comprendre",
        title: "Gouverner ne signifie pas multiplier les comités.",
        text: "Pour un pilote, il suffit souvent d’identifier le responsable métier, le référent RH et les personnes à consulter selon le sujet : DSI, DPO, juridique ou sécurité. L’important est que les rôles et la prochaine décision soient explicites.",
      },
      {
        label: "Le repère concret",
        title: "La revue doit aboutir à une décision.",
        text: "Avant même de démarrer, on prévoit une date de revue et les trois issues possibles : continuer, ajuster ou arrêter. Les résultats, limites et incidents observés nourrissent cette décision, mais ne la prennent jamais à la place des personnes responsables.",
      },
    ],
    questions: [
      {
        prompt: "Quelle organisation est suffisante et crédible pour suivre un petit pilote IA RH ?",
        choices: [
          "Aucun responsable nommé tant que les résultats sont bons.",
          "Un responsable métier, un référent RH, les personnes compétentes à consulter si nécessaire, et une date de revue fixée.",
          "Un comité hebdomadaire de toutes les directions, sans décision prévue.",
        ],
        answer: 1,
        explanation: "La gouvernance doit rester proportionnée au projet, mais elle doit permettre d’assumer une décision et d’activer les bonnes compétences si un risque apparaît.",
      },
      {
        prompt: "Après le pilote, qui décide de poursuivre, d’ajuster ou d’arrêter ?",
        choices: [
          "L’outil, à partir de ses statistiques.",
          "La personne ou l’instance humaine identifiée, sur la base des résultats, limites et garde-fous.",
          "Le dernier utilisateur qui a obtenu un bon résultat.",
        ],
        answer: 1,
        explanation: "Les indicateurs éclairent la décision ; ils ne la remplacent pas. Une décision humaine datée permet de rendre la démarche explicable et réversible.",
      },
    ],
    exchange: "Qui porterait la décision dans votre pilote, qui faudrait-il consulter, et à quelle date ?",
  },
  {
    title: "Les incidents et limites",
    subtitle: "Réagir vite, protéger les personnes et apprendre de ce qui se passe.",
    kicker: "CHAPITRE 5 · ENVIRON 12 MIN",
    icon: Lightbulb,
    color: "amber",
    takeaway: "Face à un incident, la première question est : que faut-il protéger, suspendre ou corriger ?",
    cards: [
      {
        label: "À comprendre",
        title: "Un incident n’est pas seulement un problème technique.",
        text: "Une donnée interdite, une formulation inadaptée, une erreur répétée ou un impact sur un salarié ou un candidat peut révéler une limite du pilote. La priorité est de protéger les personnes, les données et l’équité avant de rechercher un gain de productivité.",
      },
      {
        label: "Le repère concret",
        title: "Tracer pour pouvoir corriger, pas pour chercher un coupable.",
        text: "On décrit simplement ce qui s’est passé, la mesure immédiate, la personne alertée, la correction engagée et le test à refaire. Selon la gravité, le pilote est ajusté ou suspendu jusqu’à ce que les conditions soient à nouveau maîtrisées.",
      },
    ],
    questions: [
      {
        prompt: "Une formulation problématique générée par l’outil a été transmise à un collaborateur. Quelle est la première question du comité de pilotage ?",
        choices: [
          "Comment préserver malgré tout le gain de productivité ?",
          "Qui faut-il sanctionner ?",
          "Que faut-il protéger, suspendre ou corriger avant de poursuivre ?",
        ],
        answer: 2,
        explanation: "La priorité est de limiter l’impact, d’accompagner la personne concernée et de comprendre le mécanisme qui a permis l’erreur. Le pilote peut ensuite être corrigé et re-testé.",
      },
      {
        prompt: "Une donnée non autorisée a été utilisée pendant le pilote. Quelle réaction est la plus appropriée ?",
        choices: [
          "Conserver le résultat si celui-ci est utile.",
          "Documenter l’incident, alerter les personnes compétentes, retirer ou sécuriser la donnée et suspendre si le cadre n’est plus maîtrisé.",
          "Effacer discrètement la trace pour ne pas inquiéter les équipes.",
        ],
        answer: 1,
        explanation: "Une réaction responsable protège d’abord les données et les personnes, puis permet d’éviter la répétition. Elle ne consiste ni à ignorer l’incident ni à tirer une conclusion juridique automatique.",
      },
    ],
    exchange: "Quel incident réaliste pourriez-vous rencontrer, et quelle serait votre première action de protection ?",
  },
];

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { answers: {}, notes: {} };
  } catch {
    return { answers: {}, notes: {} };
  }
}

export function J3LearningLab({ back }) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [progress, setProgress] = useState(loadProgress);
  const [showAnswer, setShowAnswer] = useState({});
  const chapter = chapters[chapterIndex];
  const Icon = chapter.icon;
  const answeredCount = Object.keys(progress.answers).length;
  const totalQuestions = chapters.reduce((sum, item) => sum + item.questions.length, 0);
  const completedChapters = useMemo(() => chapters.filter((item, index) => item.questions.every((_, questionIndex) => progress.answers[`${index}-${questionIndex}`] !== undefined)).length, [progress.answers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const choose = (questionIndex, choiceIndex) => {
    const key = `${chapterIndex}-${questionIndex}`;
    setProgress((current) => ({ ...current, answers: { ...current.answers, [key]: choiceIndex } }));
    setShowAnswer((current) => ({ ...current, [key]: true }));
  };

  const updateNote = (value) => setProgress((current) => ({
    ...current,
    notes: { ...current.notes, [chapterIndex]: value },
  }));

  const reset = () => {
    if (window.confirm("Recommencer l’atelier ? Vos réponses et vos notes seront effacées sur ce navigateur.")) {
      setProgress({ answers: {}, notes: {} });
      setShowAnswer({});
      setChapterIndex(0);
    }
  };

  return <main className="j3lab-shell">
    <header className="j3lab-topbar">
      <button className="j3lab-back" onClick={back}><ArrowLeft size={18} /> Retour à la journée 3</button>
      <div className="j3lab-brand"><span><Sparkles size={16} /></span> Atelier guidé J3</div>
      <button className="j3lab-reset" onClick={reset}><RefreshCw size={14} /> Recommencer</button>
    </header>

    <section className="j3lab-hero">
      <div className="j3lab-hero-copy">
        <p>JOUR 3 · APPRENDRE AVANT D’APPLIQUER</p>
        <h1>Construire un pilote<br /><span>IA &amp; RH défendable.</span></h1>
        <div><BookOpen size={17} /> <span>5 chapitres · notions, exemples, questions expliquées et échanges</span></div>
      </div>
      <div className="j3lab-progress"><span>{completedChapters} / 5</span><b>chapitres explorés</b><div><i style={{ width: `${(answeredCount / totalQuestions) * 100}%` }} /></div></div>
    </section>

    <section className="j3lab-layout">
      <aside className="j3lab-nav">
        <p>VOTRE PARCOURS</p>
        {chapters.map((item, index) => {
          const ChapterIcon = item.icon;
          const isDone = item.questions.every((_, questionIndex) => progress.answers[`${index}-${questionIndex}`] !== undefined);
          return <button type="button" key={item.title} onClick={() => setChapterIndex(index)} className={`${index === chapterIndex ? "active" : ""} ${isDone ? "done" : ""}`}>
            <span>{isDone ? <CheckCircle2 size={16} /> : <ChapterIcon size={16} />}</span>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <em>{item.title}</em>
          </button>;
        })}
        <div className="j3lab-nav-tip"><CircleHelp size={16} /> <span>Répondez d’abord ; l’explication apparaît aussitôt pour nourrir l’échange.</span></div>
      </aside>

      <section className="j3lab-workspace">
        <div className="j3lab-heading">
          <span className={`j3lab-icon ${chapter.color}`}><Icon size={23} /></span>
          <div><p>{chapter.kicker}</p><h2>{chapter.title}</h2><span>{chapter.subtitle}</span></div>
        </div>

        <div className={`j3lab-takeaway ${chapter.color}`}><Lightbulb size={18} /><div><b>L’idée essentielle</b><p>{chapter.takeaway}</p></div></div>

        <div className="j3lab-section-heading"><span>01</span><div><h3>Comprendre le repère</h3><p>Deux notions courtes à découvrir avant de vous positionner.</p></div></div>
        <div className="j3lab-cards">
          {chapter.cards.map((card) => <article key={card.title}><span>{card.label}</span><h4>{card.title}</h4><p>{card.text}</p></article>)}
        </div>

        <div className="j3lab-section-heading"><span>02</span><div><h3>Se positionner et comprendre</h3><p>Choisissez une réponse : le débrief apparaît immédiatement.</p></div></div>
        <div className="j3lab-questions">
          {chapter.questions.map((question, questionIndex) => {
            const key = `${chapterIndex}-${questionIndex}`;
            const selected = progress.answers[key];
            const revealed = showAnswer[key] || selected !== undefined;
            return <article key={question.prompt}>
              <header><CircleHelp size={19} /><span>QUESTION {questionIndex + 1} / {chapter.questions.length}</span></header>
              <h4>{question.prompt}</h4>
              <div className="j3lab-options">
                {question.choices.map((choice, choiceIndex) => {
                  const isSelected = selected === choiceIndex;
                  const isCorrect = question.answer === choiceIndex;
                  return <button type="button" disabled={selected !== undefined} key={choice} onClick={() => choose(questionIndex, choiceIndex)} className={`${isSelected ? "selected" : ""} ${revealed && isCorrect ? "correct" : ""} ${revealed && isSelected && !isCorrect ? "incorrect" : ""}`}>
                    <span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}{revealed && isCorrect && <CheckCircle2 size={18} />}
                  </button>;
                })}
              </div>
              {revealed && <div className={`j3lab-answer ${selected === question.answer ? "success" : ""}`}><Lightbulb size={19} /><div><b>{selected === question.answer ? "Bonne lecture de la situation" : "La réponse attendue"}</b><p>{question.explanation}</p></div></div>}
            </article>;
          })}
        </div>

        <div className="j3lab-section-heading"><span>03</span><div><h3>Échanger et faire le lien</h3><p>Ce temps est fait pour la discussion : aucune réponse n’est évaluée ni exportée.</p></div></div>
        <section className="j3lab-exchange">
          <div><MessageCircle size={21} /><span>QUESTION À DISCUTER EN CLASSE VIRTUELLE</span></div>
          <h3>{chapter.exchange}</h3>
          <label>Ma note personnelle <small>facultative · enregistrée uniquement dans ce navigateur</small>
            <textarea value={progress.notes[chapterIndex] || ""} onChange={(event) => updateNote(event.target.value)} placeholder="Un point à retenir pour mon projet, une question à poser, une décision à préciser…" />
          </label>
        </section>

        <footer className="j3lab-actions">
          <button type="button" disabled={chapterIndex === 0} onClick={() => setChapterIndex((current) => current - 1)}><ChevronLeft size={18} /> Chapitre précédent</button>
          {chapterIndex < chapters.length - 1 ? <button type="button" className="primary" onClick={() => setChapterIndex((current) => current + 1)}>Chapitre suivant <ChevronRight size={18} /></button> : <button type="button" className="primary" onClick={back}>Passer au Studio final <ArrowRight size={18} /></button>}
        </footer>
      </section>
    </section>
  </main>;
}
