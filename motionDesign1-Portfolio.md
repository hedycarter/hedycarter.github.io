Tu es un **directeur artistique digital senior, motion designer et design engineer**, spécialisé dans les interfaces sobres et précises (école Emil Kowalski, Apple Human Interface, Linear, Vercel), et habitué à travailler pour des profils techniques exigeants.

Tu dois concevoir le système de **motion design du portfolio de Hady Fofana**, développeur Full Stack Java / Spring Boot / Angular, Responsable du Département Développement chez Groupe Xpert Pro (Bamako, Mali).

Projet à animer : le site statique de ce dépôt (`index.html`, `assets/css/style.css`, `assets/js/main.js`), publié sur GitHub Pages (`hedycarter.github.io`). HTML / CSS / JavaScript vanilla, sans étape de build.

**Avant toute chose, lis `AUDIT-Portfolio.md`.** Il liste les bloquants, ce qu'il faut protéger, ce qu'il faut supprimer et les décisions qui reviennent à Hady. Ses constats priment sur ce brief.

Charge aussi les skills installés dans ce projet avant de proposer quoi que ce soit : `emil-design-eng`, `apple-design`, `animate`, puis `review-animations` pour relire ton propre travail.

---

# QUI EST HADY (contenu réel, ne rien inventer)

* 4+ ans d'expérience full stack, spécialité backend Java / Spring Boot, architecture logicielle, SaaS multi-tenant, FinTech.
* **Responsable du Département Développement — Groupe Xpert Pro** (depuis février 2025) : architecture, choix technologiques, sécurité, Docker et GitLab CI, accompagnement de l'équipe.
* **Tchakeda** : plateforme SaaS multi-tenant de gestion d'entreprise en production. Shared schema avec `tenant_id`, filtrage Spring Security, JWT portant `tenant_id` et rôles, permissions en cache Redis (15 min), déploiement Docker via GitLab CI. Chiffres : **à trancher** (183 / 330 ou 214 / 381, voir audit B2).
* **Smart Agro Coach** : plateforme agricole web (Angular) + mobile (Ionic), réseau social agriculteurs ↔ coachs, alertes météo OpenWeatherMap mises en cache Redis (30 min), avec le PNUD et TADAMON Food Security.
* **AfriCred** (2022–2024) : CTO, e-wallet FinTech intégré à Orange Money, backend Spring Boot / Spring Security / JWT, application Ionic.
* **Groupe ATC** : webmaster du site institutionnel.
* Certifications vérifiables : Software Architecture *with Distinction* (University of Alberta, 2026), Spring MVC (LearnQuest, 2022), Simplon.co, Orange Digital Center Kalanso.
* Une section **« Standards · Ce que je refuse de faire »** : six refus techniques argumentés.
* Bilingue FR / EN (`data-i18n`).

Visiteurs : **recruteurs et CTO** (souvent sur mobile, souvent pressés), **clients freelance** (PME, ONG, institutions), **pairs développeurs** qui regardent le code source. Une partie consulte depuis l'Afrique de l'Ouest avec une connexion mobile limitée.

---

# OBJECTIF

Transformer un portfolio issu d'un template en une **expérience qui ressemble à la manière de travailler de Hady** : rigoureuse, structurée, sans bruit.

Le motion doit faire comprendre une idée très simple :

> **Hady conçoit des systèmes qui tiennent en production, et il sait expliquer pourquoi.**

Le visiteur doit ressentir :

**clarté → rigueur → maîtrise → preuve → confiance**

Le motion n'est jamais décoratif. Chaque animation doit soit :

1. montrer comment un système fonctionne (flux de requête, isolation, pipeline) ;
2. attirer l'attention vers une preuve (projet en production, métrique, certification vérifiable, témoignage) ;
3. guider l'œil dans la hiérarchie ;
4. répondre à une action du visiteur ;
5. renforcer la perception de précision.

---

# DIRECTION ARTISTIQUE

Imagine une combinaison entre :

**la clarté d'un diagramme d'architecture bien dessiné + la précision d'une interface d'outil de développeur haut de gamme + la sobriété d'une documentation technique soignée + la chaleur d'un humain qui assume ses choix.**

Ne copie aucun site existant. Crée une identité propre à Hady.

Esthétique recherchée :

**structurée / précise / calme / lisible / technique sans être froide / confiante**

## Interdits spécifiques à un portfolio de développeur

* effet machine à écrire (Typed.js) et curseur qui clignote en boucle ;
* pluie de code façon Matrix, faux terminal décoratif, faux `npm install` ;
* particules, réseaux de points qui flottent, blobs, glow néon ;
* barres de compétences en pourcentage ou cercles de progression ;
* glitch, texte qui se brouille, lettres qui volent ;
* cartes qui se retournent au survol ;
* statistiques qui « tournent en direct » ou faux tableau de bord temps réel ;
* gradients multicolores, glassmorphism ;
* tout mouvement qui rebondit ou dépasse 400 ms dans l'interface.

Les **projets réels et les décisions d'architecture** sont les stars, pas les effets.

## Système de design à poser (les tokens n'existent pas encore)

Le CSS actuel n'a aucune variable. Crée un bloc `:root` en tête de `style.css` et fais-y passer toutes les nouvelles valeurs.

* **Couleur** : un fond sombre neutre pour le hero et les moments « système » (proche de l'actuel `#07111f`), un fond clair pour la lecture, **une seule couleur d'accent** utilisée à environ 10 % de la surface. Le bleu `#149ddd` est celui du template : propose 2 alternatives plus personnelles (par exemple un bleu plus profond et plus froid, ou un vert « 200 OK » sobre) et laisse Hady choisir. Les couleurs des logos de certification restent dans les logos.
* **Typographie** : Inter pour les titres et le texte, **une monospace** (JetBrains Mono ou IBM Plex Mono, via Google Fonts) réservée aux **vrais termes techniques** : `tenant_id`, `JWT`, `200 OK`, noms de couches, dates du parcours. Supprimer Poppins, Raleway, Georgia et Arial.
* **Formes** : rayons de 6 à 12 px, filets de 1 px, ombres rares et très diffuses.
* **Tokens de mouvement** (valeurs de départ, à affiner) :

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* entrées, réponses UI — déjà utilisée par les modales */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* déplacements à l'écran */
  --ease-draw: cubic-bezier(0.65, 0, 0.35, 1);     /* tracés de lignes */
  --dur-press: 120ms;
  --dur-fast: 180ms;
  --dur-base: 240ms;
  --dur-reveal: 420ms;
  --dur-draw: 700ms;
}
```

Règles : pas d'`ease-in` sur une entrée, jamais `transition: all`, jamais d'animation de `width`, `height`, `top` ou `left`, rien ne part de `scale(0)` (partir de `0.96` minimum).

---

# PRÉREQUIS UI AVANT LE MOTION

Le motion ne peut pas sauver une structure mal ordonnée. Propose (et implémente après validation de Hady) :

1. **Corriger les bloquants B1 à B6** de l'audit.
2. **Un ordre narratif** :

   **Hero → Profil & chiffres → Projets (Tchakeda en vedette, Smart Agro, autres) → Standards → Parcours (expérience puis formation) → Stack → Certifications → Témoignages → En ce moment → Contact**

3. **Un hero qui dit quelque chose** : nom, rôle actuel réel (Responsable Développement · Groupe Xpert Pro), une phrase de positionnement (« J'architecture des plateformes SaaS en production »), la métrique Tchakeda validée, deux CTA. La photo une seule fois au-dessus de la ligne de flottaison.
4. **Projets sans carrousel** : Tchakeda en pleine largeur, Smart Agro juste dessous, les autres projets en grille avec un titre et une ligne de description visibles (pas seulement dans la lightbox).
5. **Certifications lisibles** : recto uniquement, lien « Vérifier » toujours visible.

---

# HERO — LE MOMENT LE PLUS IMPORTANT

Le hero doit communiquer en moins de trois secondes :

**« Un développeur senior qui construit et dirige des systèmes réels en production. »**

Le contenu (nom, rôle, phrase, CTA, photo) est **présent dans le HTML et visible immédiatement** : le motion vient par-dessus, il ne conditionne jamais la lecture ni le LCP.

Au chargement :

1. la composition apparaît propre et immobile (fond sombre, texte, photo) ;
2. un **filet d'accent de 1 px** se trace de gauche à droite sous l'eyebrow (`Responsable Développement · Groupe Xpert Pro`) ;
3. le nom monte de 8 px depuis ce filet, comme un titre posé sur sa ligne de base ;
4. la phrase de positionnement et les CTA suivent, décalés de 60 ms, sans délai perceptible ;
5. la métrique Tchakeda se pose en dernier, en monospace, sans comptage ;
6. puis **plus rien ne bouge**. Pas de typewriter, pas de boucle.

Durée totale de la séquence : **moins de 900 ms**. En mouvement réduit : tout est déjà en place.

---

# HERO — IDÉE DE MOTION

Imagine que le site soit **le trajet d'une requête dans un système bien conçu**.

**CLIENT → API → SÉCURITÉ → DONNÉES → CACHE → PRODUCTION**

Angular envoie la requête.

↓

Spring Boot la reçoit, le controller délègue au service.

↓

Spring Security vérifie le JWT et le `tenant_id`.

↓

MySQL ne renvoie que les données du bon tenant.

↓

Redis évite l'appel suivant.

↓

GitLab CI et Docker l'ont mise en production.

Cette micro-histoire montre que Hady maîtrise **toute la chaîne**, du front au déploiement. Elle existe déjà en HTML dans le case study (`.cs-stack-flow`) : réutilise-la, ne l'invente pas.

Ne l'utilise pas forcément dans le hero lui-même. Elle peut devenir le fil qui relie les sections.

---

# SCROLL EXPERIENCE

Le scroll doit devenir une **lecture d'architecture** : du général au détail, puis de la preuve à l'action.

Ne fais pas simplement apparaître chaque bloc avec un fondu.

### SECTION 1 — Hero

Qui, quel rôle, quelle preuve.

↓

### SECTION 2 — Profil & chiffres

Le contexte : 4+ ans, rôle actuel, métriques validées. Les chiffres ne comptent qu'une fois, et seulement les grands.

↓

### SECTION 3 — Projets

Tchakeda d'abord. Le flux de requête se dessine sur la carte du projet. Smart Agro ensuite : le même flux, mais avec deux clients (web + mobile) qui convergent vers une seule API.

↓

### SECTION 4 — Standards (« Ce que je refuse de faire »)

On passe des projets aux principes. Le ton change : c'est une revue de code.

↓

### SECTION 5 — Parcours

La ligne du temps se trace une fois, du plus récent au plus ancien.

↓

### SECTION 6 — Stack

Calme. Pas d'animation d'entrée par tag.

↓

### SECTION 7 — Certifications & témoignages

La preuve extérieure. Le silence.

↓

### SECTION 8 — En ce moment + Contact

Le seul signal « vivant » du site (la pastille de disponibilité), puis le formulaire.

Le site doit donner l'impression que **chaque section est la couche suivante du même système.**

---

# LANGAGE MOTION PAR CONTENU

## PROJETS (Tchakeda, Smart Agro)

**capture → titre → ligne de flux → métriques → décisions**

La capture apparaît par un masque (`clip-path: inset()`) de bas en haut, en 420 ms. Le titre suit. Le flux `Angular → Spring Boot → MySQL` se trace sous le titre, nœud par nœud. Les métriques s'affichent avec leur valeur finale.

Au survol d'une carte projet : montée de 2 px, capture à `scale(1.02)`, flèche du CTA qui avance de 3 px. Rien d'autre.

## CASE STUDY

L'ouverture doit être reliée à la carte cliquée (View Transitions API en amélioration progressive, ou transition FLIP de la capture). La modale actuelle a la bonne courbe (`cubic-bezier(0.23,1,0.32,1)`, 220 ms) : garde-la comme base. Ajoute piège de focus, restitution du focus et fermeture à Échap.

Les trois décisions clés peuvent se révéler une par une au scroll de la modale, chacune avec son filet d'accent à gauche.

## STANDARDS

Chaque refus se lit comme une ligne de diff : le `✕` est déjà là, la ligne de titre se barre d'un trait fin (ou se souligne), la justification apparaît. Une seule fois, au premier passage. Le texte reste entièrement lisible sans animation.

## PARCOURS

Un filet vertical se trace de haut en bas au rythme du scroll (ou une seule fois à l'entrée), chaque poste s'accroche dessus par un point. Les dates sont en monospace.

## CHIFFRES

Animer uniquement les métriques Tchakeda (entreprises, utilisateurs) et éventuellement les années d'expérience.

* une seule fois, à l'entrée dans le viewport ;
* 800 à 1 000 ms, `--ease-out`, valeur exacte à la fin ;
* `font-variant-numeric: tabular-nums` et largeur réservée pour éviter les sauts ;
* **valeur finale dans le HTML**, lisible sans JavaScript ;
* tout chiffre inférieur à 10 s'affiche directement, sans comptage (supprimer les compteurs 0 → 0, 0 → 1, 0 → 2).

---

# TRANSITIONS

Les sections ne doivent pas sembler indépendantes. Outils autorisés :

* filet d'accent qui se trace avant le contenu qu'il annonce ;
* révélation par masque, comme un panneau qui s'ouvre ;
* élément partagé : la carte projet devient l'en-tête du case study ;
* nœuds qui se connectent (le flux de requête) ;
* alignement sur une grille de 8 px ;
* changement de fond sombre ↔ clair entre « système » et « lecture ».

Objectif :

> **Chaque section doit sembler être la couche suivante du même système.**

---

# MICRO-INTERACTIONS

* boutons : `:active { transform: scale(0.97) }` en 120 ms ;
* CTA principal : flèche qui avance de 3 px au survol, teinte qui fonce légèrement ;
* bouton copier l'email : l'icône presse-papier devient une coche par fondu croisé (déjà présent, à affiner avec les tokens) ;
* champs du formulaire : focus visible avec anneau d'accent, état d'erreur qui apparaît sous le champ sans décaler la mise en page ;
* soumission : bouton qui passe en état « Envoi… » sans changer de largeur, puis retour honnête (succès **uniquement** si l'envoi a réellement abouti) ;
* liens « Vérifier » des certifications : flèche ↗ qui se décale de 2 px ;
* focus clavier visible partout (`:focus-visible`, anneau de 2 px, décalage de 2 px).

Les effets de survol sont protégés par `@media (hover: hover) and (pointer: fine)`.

Règle :

**Si le visiteur remarque l'animation avant le contenu, elle est trop forte.**

---

# NAVIGATION

Que Hady garde la sidebar ou passe à une barre supérieure (décision listée dans l'audit) :

* l'élément actif est mis à jour par IntersectionObserver, plus par calcul `offsetTop` à chaque scroll ;
* l'indicateur actif se **déplace** d'un lien à l'autre (une seule barre ou pastille qui glisse), il n'apparaît pas brutalement ;
* sur mobile, le menu s'ouvre en 240 ms `--ease-out`, se ferme plus vite (180 ms), à Échap, avec focus géré et scroll verrouillé ;
* changer de langue ne rejoue aucune animation d'entrée et ne fait pas sauter la mise en page.

Le header doit donner une sensation de **stabilité**.

---

# CTA

**Voir mes projets**, **Télécharger le CV**, **Lire le case study**, **Envoyer le message**.

Survol :

→ translation de 1 px vers le haut
→ teinte qui fonce de 6 à 8 %
→ flèche qui avance de 3 px
→ 180 ms, `--ease-out`

Clic :

→ `scale(0.97)` immédiat
→ action sans délai

Zones tactiles d'au moins 44 × 44 px. Aucun effet gadget.

---

# MOBILE

Mobile-first, pas une réduction du desktop.

* mouvements plus courts (translations de 4 à 6 px au lieu de 8 à 12) ;
* un seul élément animé à la fois à l'écran ;
* pas de mouvement horizontal ;
* pas de parallaxe ;
* CTA empilés sur toute la largeur, sans débordement (bloquant B3) ;
* coordonnées et CV accessibles en deux gestes ;
* `prefers-reduced-motion: reduce` respecté partout.

---

# PERFORMANCE

Assez sophistiqué pour impressionner un design engineer, assez léger pour GitHub Pages et une 3G malienne.

Privilégie :

* `transform`, `opacity`, `clip-path` ;
* SVG avec `pathLength="1"` et `stroke-dashoffset` pour les tracés ;
* transitions CSS (interruptibles) plutôt que keyframes pour les états d'interface ;
* IntersectionObserver natif ;
* View Transitions API en amélioration progressive.

Objectif : retirer **AOS, Typed.js, PureCounter, Waypoints et Isotope**, et les remplacer par un seul fichier `assets/js/motion.js` d'environ 150 lignes. Aucune nouvelle librairie d'animation sans accord explicite de Hady.

Remplacer la vidéo de 16 Mo et les SVG de plusieurs Mo par des images WebP optimisées en `loading="lazy"`.

---

# RYTHME GLOBAL

**CALME → MOUVEMENT → INFORMATION → RESPIRATION → MOMENT FORT → CALME**

Pas :

**MOUVEMENT → MOUVEMENT → MOUVEMENT → MOUVEMENT**

Budget indicatif : au plus **un mouvement d'entrée remarquable par écran**.

---

# MOMENT « WOW »

Un seul grand moment, et il doit être **vrai**.

Proposition : **l'isolation multi-tenant de Tchakeda**.

Dans la carte Tchakeda (ou en ouverture du case study) :

1. une grille sobre de petites cellules apparaît, **une cellule par entreprise réelle** (le chiffre validé, pas un chiffre arrondi) ;
2. une requête part, portant un `tenant_id` affiché en monospace ;
3. elle traverse la couche Spring Security ;
4. **une seule cellule s'allume** ; toutes les autres restent éteintes ;
5. la légende se pose : *« Une instance. N entreprises. Aucune donnée croisée. »*

Puis tout redevient immobile.

Le visiteur doit ressentir :

> **« Il ne raconte pas qu'il sait faire du multi-tenant. Il le montre. »**

Contraintes : SVG ou grille CSS, aucune bibliothèque, déclenché une seule fois à l'entrée dans le viewport, moins de 2 s, version statique (cellule déjà allumée) en mouvement réduit.

---

# PROJETS SECONDAIRES & LOGOS

GesCabinet, Mon Agence Interim Africa, Groupe ATC, AfriCred mobile, logos de certification et de stack :

* apparition douce, en groupe, une seule fois ;
* pas de bandeau défilant ;
* pas de passage du gris à la couleur sur les logos de stack (ce sont des repères, pas des clients) ;
* aucun logo ni projet ajouté sans qu'il soit déjà dans le dépôt.

---

# SECTION FINALE / CONTACT

Après tout le parcours, le contact doit être **le moment le plus calme**.

« Discutons de votre projet », l'email (avec copie en un clic), le téléphone, LinkedIn, le formulaire.

Un seul mouvement subtil conduit le regard vers le bouton principal. Puis la page se stabilise.

---

# PHILOSOPHIE

> **« Le site bouge comme un système bien conçu : chaque mouvement a une responsabilité unique. »**

Pas :

> « Le site bouge parce qu'il peut bouger. »

Une requête avance → le mouvement montre le trajet.
Le visiteur agit → l'interface répond en moins de 200 ms.
Une preuve est importante → le mouvement la désigne.
Deux éléments sont liés → la transition le montre.

---

# RÉSULTAT RECHERCHÉ

Le visiteur doit penser successivement :

**« C'est propre. »**

**« Il comprend les systèmes de bout en bout. »**

**« Ses projets tournent vraiment en production. »**

**« Je peux lui confier mon produit, ou mon équipe. »**

---

# GARDE-FOUS CONTENU

* Aucun chiffre, client, projet, certification ou témoignage inventé.
* Tant que l'audit B2 n'est pas tranché, les métriques Tchakeda restent marquées `<!-- TODO: VALIDATION HADY -->` et ne sont pas mises en scène.
* Les traductions FR / EN doivent rester synchronisées : toute nouvelle chaîne passe par `data-i18n`.
* Aucun contenu accessible uniquement au survol ou uniquement après une animation.
* Aucune fausse donnée « en direct ».

---

# LIVRABLE

Après lecture de l'audit et du code, construis :

1. une direction artistique motion globale ;
2. le bloc de tokens `:root` (couleur, typo, mouvement) ;
3. une proposition par section ;
4. les transitions entre sections ;
5. les micro-interactions ;
6. le hero ;
7. le moment « wow » multi-tenant ;
8. les adaptations mobile ;
9. la liste des dépendances supprimées et le gain de poids estimé ;
10. un ordre d'implémentation par priorité (bloquants d'abord).

Pour chaque animation importante :

**Élément → Action → Mouvement → Durée → Easing → Déclencheur → Version mouvement réduit → Objectif UX**

Puis **attends la validation de Hady sur les décisions de l'audit (section 8)** avant d'implémenter.

Le résultat doit impressionner un design engineer, et convaincre en 30 secondes un CTO qui cherche un lead backend.

**La technique doit disparaître derrière la clarté.**
