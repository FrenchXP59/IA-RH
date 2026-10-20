import { useMemo, useState } from "react";
import { ArrowLeft, BookOpen, Code2, Lightbulb, Search, Sparkles, X } from "lucide-react";
import "./J3Glossary.css";

const groups = [
  { id: "all", label: "Tous les repères", tone: "all" },
  { id: "j1", label: "J1 · Cadrer", tone: "violet" },
  { id: "j2", label: "J2 · Concevoir", tone: "blue" },
  { id: "j3", label: "J3 · Piloter", tone: "teal" },
  { id: "web", label: "Landing page", tone: "coral" },
];

const entries = [
  { group: "j1", term: "IA générative", definition: "Une IA qui produit ou transforme un contenu : texte, image, synthèse, plan ou brouillon. Elle ne remplace pas la décision humaine.", example: "Préparer une première version d’une offre d’emploi à partir d’une fiche de poste validée." },
  { group: "j1", term: "Processus RH", definition: "Une suite d’étapes, d’acteurs et de décisions qui permet de réaliser une activité RH.", example: "Recrutement, onboarding, entretien professionnel ou développement des compétences." },
  { group: "j1", term: "Opportunité IA", definition: "Un usage précis où l’IA peut assister une activité et apporter un gain identifié, tout en conservant un contrôle humain.", example: "Structurer un brouillon de FAQ à partir de sources validées." },
  { group: "j1", term: "Périmètre / hors périmètre", definition: "Ce que le projet couvre explicitement et, tout aussi important, ce qu’il exclut. Cette limite évite les glissements d’usage.", example: "Produire un brouillon ; hors périmètre : classer ou écarter automatiquement des candidats." },
  { group: "j1", term: "Baseline", definition: "La valeur initiale mesurée avant le projet. Elle sert de point de comparaison pour évaluer une évolution réelle.", example: "Temps moyen actuel pour préparer une synthèse : 45 minutes." },
  { group: "j1", term: "Finalité", definition: "Le résultat métier recherché et explicable. Elle répond à la question : pourquoi ce traitement ou cet outil est-il utilisé ?", example: "Aider les HRBP à préparer un brouillon homogène, relu avant utilisation." },
  { group: "j1", term: "Minimisation", definition: "Le principe qui consiste à n’utiliser que les données nécessaires à la finalité définie, et à exclure le reste.", example: "Utiliser une fiche de poste validée, sans ajouter de CV ni de données d’évaluation." },
  { group: "j1", term: "Décision humaine", definition: "Une décision prise, validée et assumée par une personne identifiée. L’IA peut assister l’analyse, mais ne décide pas seule pour une personne.", example: "Le manager et les RH valident le contenu final avant sa diffusion." },
  { group: "j2", term: "Prompt", definition: "Une consigne structurée donnée à une IA : objectif, contexte, sources autorisées, contraintes et format attendu.", example: "Rédiger un brouillon de PDI, sans inventer d’information et avec validation humaine obligatoire." },
  { group: "j2", term: "Prompt de production", definition: "Une consigne destinée à générer un premier résultat : brouillon, tableau, note ou plan.", example: "Proposer un tableau de plan de développement individuel à partir des éléments validés." },
  { group: "j2", term: "Prompt de contrôle", definition: "Une consigne distincte qui cherche les écarts, oublis, formulations risquées et éléments à vérifier dans une production.", example: "Repérer les informations inventées, stéréotypes, données inutiles ou lacunes du brouillon." },
  { group: "j2", term: "Sources autorisées", definition: "Les documents, données fictives, données synthétiques ou informations validées que l’on peut utiliser dans l’exercice ou l’outil.", example: "Une fiche de poste, un référentiel métier validé ou un cas pédagogique fictif." },
  { group: "j2", term: "Données synthétiques", definition: "Des données créées pour représenter une situation sans reprendre les données personnelles réelles d’une personne.", example: "Un profil fictif de salarié utilisé pour tester un brouillon de PDI." },
  { group: "j2", term: "Accessibilité testable", definition: "Une exigence concrète que l’on peut vérifier : structure lisible, langage clair, tableau compréhensible ou information non portée uniquement par la couleur.", example: "Le résultat doit pouvoir être compris sans dépendre d’un code couleur seul." },
  { group: "j2", term: "Test normal / limite / interdit", definition: "Trois situations de test complémentaires : usage attendu, cas délicat mais possible, et situation qui ne doit pas être traitée.", example: "Une demande sans source validée appartient au test interdit." },
  { group: "j2", term: "GO · AJUSTER · STOP", definition: "Les trois décisions possibles après un test. GO : critères atteints ; AJUSTER : correction et nouveau test ; STOP : prérequis ou risque non maîtrisé.", example: "Une donnée interdite non sécurisée mène à STOP ou à une suspension du test." },
  { group: "j3", term: "Prototype", definition: "Une première matérialisation qui vérifie qu’une idée est réalisable. Il ne prouve pas encore que l’usage est pertinent ou déployable.", example: "Un exemple de brouillon généré à partir d’un cas fictif." },
  { group: "j3", term: "Pilote", definition: "Une expérimentation limitée, mesurée et réversible, menée avec un responsable, une durée et une règle d’arrêt.", example: "Tester pendant six semaines avec deux HRBP, avant toute généralisation." },
  { group: "j3", term: "Réversibilité", definition: "La capacité à ajuster ou arrêter un usage sans créer d’impact injuste ou durable pour les personnes concernées.", example: "Conserver le processus habituel pendant le pilote et ne pas automatiser de décision." },
  { group: "j3", term: "Indicateur d’efficacité", definition: "Une mesure du temps, du délai ou du volume traité. Il renseigne un bénéfice opérationnel, mais ne suffit pas seul.", example: "Temps moyen de préparation d’un document." },
  { group: "j3", term: "Indicateur de qualité", definition: "Une mesure des retouches, erreurs, incidents ou écarts par rapport au résultat attendu.", example: "Pourcentage de brouillons nécessitant une correction majeure." },
  { group: "j3", term: "Indicateur de relation humaine", definition: "Une mesure de la compréhension, de l’expérience des personnes et de l’accès à une aide ou un recours humain.", example: "Nombre de demandes d’explication ou de recours adressées aux RH." },
  { group: "j3", term: "Gouvernance légère", definition: "Une organisation proportionnée au pilote : responsable métier, référent RH, personnes à consulter si nécessaire, date de revue et décision attendue.", example: "Une revue à six semaines pour décider de continuer, ajuster ou arrêter." },
  { group: "j3", term: "Incident", definition: "Un événement qui révèle un risque, une erreur, une donnée non autorisée ou un impact non prévu. Il doit être protégé, tracé, corrigé et, si besoin, suivi d’une suspension.", example: "Une formulation inadaptée est transmise à un salarié." },
  { group: "web", term: "Landing page", definition: "Une page web conçue pour présenter clairement une offre, un projet, une formation ou une action précise, et guider vers une action.", example: "Une page qui présente un parcours IA & RH et permet d’accéder aux ressources." },
  { group: "web", term: "Front-end", definition: "La partie visible et interactive d’une application web : écrans, boutons, formulaires, navigation et comportement dans le navigateur.", example: "La page J3, ses cartes, son quiz et son bouton vers le Studio final." },
  { group: "web", term: "Interface utilisateur (UI)", definition: "L’ensemble des éléments avec lesquels une personne interagit : titres, champs, boutons, couleurs, icônes et retours visuels.", example: "Une carte de question qui indique clairement la réponse sélectionnée." },
  { group: "web", term: "Expérience utilisateur (UX)", definition: "La qualité du parcours vécu par l’utilisateur : compréhension, fluidité, effort demandé, confiance et accessibilité.", example: "Découvrir une notion, répondre, lire l’explication puis échanger sans changer d’écran." },
  { group: "web", term: "Design responsive", definition: "Un design qui s’adapte aux grands écrans, tablettes et mobiles, sans perdre les fonctions essentielles ni la lisibilité.", example: "Les cartes passent en une colonne et la navigation devient défilable sur mobile." },
  { group: "web", term: "Icônes Lucide", definition: "Une bibliothèque d’icônes vectorielles cohérentes et légères, utilisée pour rendre les actions et repères plus compréhensibles.", example: "Une fusée pour le pilote, un bouclier pour la gouvernance, une ampoule pour l’idée essentielle." },
  { group: "web", term: "Tailwind CSS", definition: "Un outil de mise en forme par classes utilitaires, utilisé pour construire rapidement une interface cohérente. Il peut coexister avec du CSS sur mesure.", example: "Définir les espacements, couleurs, bordures et comportements responsives d’une carte." },
  { group: "web", term: "React", definition: "Une bibliothèque JavaScript qui construit l’interface sous forme de composants réutilisables et réactifs aux actions de l’utilisateur.", example: "Un composant Quiz qui affiche une question, enregistre le choix et révèle le débrief." },
  { group: "web", term: "Composant", definition: "Un bloc d’interface autonome et réutilisable : il rassemble un rôle, son contenu et son comportement.", example: "Une carte ressource, une question de quiz ou une étape du Studio final." },
  { group: "web", term: "Antigravity", definition: "Un environnement d’assistance au développement par IA, utilisé pour transformer une intention ou un prompt en proposition de code et d’interface. Le résultat doit toujours être relu, testé et adapté au besoin réel.", example: "Décrire une landing page, puis vérifier la structure, le texte, la responsivité et l’accessibilité générés." },
  { group: "web", term: "GitHub", definition: "Un espace de gestion de versions qui permet de conserver le code, suivre ses évolutions et partager un projet.", example: "Le dépôt IA-RH conserve les composants et les ressources de l’espace apprenant." },
  { group: "web", term: "Netlify", definition: "Un service qui construit et publie une application web afin qu’elle soit accessible en ligne via une adresse web.", example: "La mise à jour de l’espace apprenant est déployée sur ia-rh.horizonduo.net." },
];

export function J3Glossary({ back }) {
  const [group, setGroup] = useState("all");
  const [search, setSearch] = useState("");
  const [openTerm, setOpenTerm] = useState(null);
  const visibleEntries = useMemo(() => entries.filter((entry) => {
    const inGroup = group === "all" || entry.group === group;
    const inSearch = `${entry.term} ${entry.definition} ${entry.example}`.toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr"));
    return inGroup && inSearch;
  }), [group, search]);

  return <main className="glossary-shell">
    <header className="glossary-topbar">
      <button onClick={back}><ArrowLeft size={18} /> Retour à la journée 3</button>
      <div><span><BookOpen size={16} /></span> Glossaire IA &amp; RH</div>
      <p><Sparkles size={14} /> Les mots utiles pour comprendre et agir</p>
    </header>
    <section className="glossary-hero">
      <div><p>J1 À J3 · REPÈRES COMMUNS</p><h1>Parler IA &amp; RH<br /><span>avec les bons mots.</span></h1><p>Des définitions simples, des exemples RH et le vocabulaire de création de landing page associé au bonus Antigravity.</p></div>
      <div className="glossary-hero-card"><Code2 size={25} /><b>Un mot rencontré ?</b><span>Ouvrez sa fiche et retrouvez une explication concrète.</span></div>
    </section>
    <section className="glossary-content">
      <div className="glossary-toolbar"><div className="glossary-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un terme ou une notion…" />{search && <button onClick={() => setSearch("")} aria-label="Effacer la recherche"><X size={15} /></button>}</div><span>{visibleEntries.length} repère{visibleEntries.length > 1 ? "s" : ""}</span></div>
      <div className="glossary-tabs">{groups.map((item) => <button key={item.id} className={`${group === item.id ? "active" : ""} ${item.tone}`} onClick={() => setGroup(item.id)}>{item.label}</button>)}</div>
      <div className="glossary-grid">{visibleEntries.map((entry) => <article key={entry.term} className={`${entry.group} ${openTerm === entry.term ? "open" : ""}`}>
        <button className="glossary-card-head" onClick={() => setOpenTerm((current) => current === entry.term ? null : entry.term)}><span>{groups.find((item) => item.id === entry.group)?.label.replace(" · ", " ")}</span><h2>{entry.term}</h2><i>{openTerm === entry.term ? "−" : "+"}</i></button>
        <div className="glossary-card-body"><p>{entry.definition}</p><div><b>Exemple</b><span>{entry.example}</span></div></div>
      </article>)}</div>
      {!visibleEntries.length && <div className="glossary-empty"><Lightbulb size={22} /><b>Aucun repère trouvé</b><span>Essayez un autre mot ou revenez à « Tous les repères ».</span></div>}
    </section>
  </main>;
}
