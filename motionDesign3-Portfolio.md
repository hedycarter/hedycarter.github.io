La version actuelle est réussie et j'aime beaucoup le résultat.

**Ne cherche surtout pas à ajouter plus d'animations.**

Interviens maintenant comme **Creative Director + Experience Designer + Motion Director de niveau international**, et pose-toi une seule question :

> **« Qu'est-ce qui manque encore pour qu'un CTO se souvienne du portfolio de Hady Fofana une semaine plus tard ? »**

À ce stade, les améliorations viennent des **idées, de la narration, de la surprise et de la finition**, pas de l'accumulation.

Sois extrêmement critique envers ton propre travail.

Rappels permanents :

* `AUDIT-Portfolio.md` fait foi pour le contenu et les décisions de Hady ;
* tokens `:root` comme seule source de valeurs ;
* WCAG 2.2 AA, HTML / CSS / JS vanilla, GitHub Pages ;
* charge `emil-design-eng`, `apple-design`, `animate`, puis `improve-animations` pour l'audit de départ et `review-animations` avant de livrer ;
* aucune donnée inventée.

---

# 01 — DÉPASSE LE CONCEPT DE « PORTFOLIO »

Je ne veux plus que le site soit perçu comme :

> « un CV en ligne avec de belles animations. »

Je veux qu'il soit perçu comme :

> **« une revue d'architecture guidée, faite par la personne qui a construit les systèmes. »**

Le visiteur doit oublier quelques secondes qu'il lit un portfolio et avoir l'impression **d'ouvrir les systèmes que Hady a conçus**.

Sans sacrifier :

* la clarté (qui, quoi, preuve en moins de 10 secondes) ;
* l'accès au CV et au contact ;
* la performance ;
* l'accessibilité ;
* la simplicité.

---

# 02 — CRÉE UN « MONDE HADY »

Tout le site doit fonctionner comme **un seul système cohérent**, où les mêmes éléments réapparaissent sous différentes formes.

Par exemple, le filet d'accent du hero peut devenir :

→ le soulignement d'un titre de section

→ la ligne du flux de requête dans la carte Tchakeda

→ le trait qui barre une mauvaise pratique dans Standards

→ la ligne du parcours professionnel

→ la séparation avant le contact

→ le trajet de la requête envoyée par le formulaire.

D'autres formes peuvent revenir : la cellule de tenant, le libellé monospace, le nœud du schéma, la coche de validation.

Je veux un **vocabulaire visuel récurrent** que le visiteur découvre progressivement.

Liste explicitement ce vocabulaire (5 à 7 éléments maximum) et, pour chacun, chaque endroit où il apparaît.

---

# 03 — DONNE UNE « MÉMOIRE » AU SITE

Certains éléments doivent avoir une continuité réelle.

* Si `Redis` apparaît dans la stack, il réapparaît dans le schéma de Tchakeda (cache des permissions, 15 min) et de Smart Agro (cache météo, 30 min) : même libellé, même forme.
* Si la métrique d'entreprises apparaît dans le hero ou le profil, c'est **la même** qui remplit la grille multi-tenant et qui s'affiche dans le case study.
* Si un refus de la section Standards parle d'isolation multi-tenant, la décision correspondante du case study le rappelle visuellement.
* Si le parcours mentionne AfriCred, la mention JWT / Spring Security de la stack s'y rattache.

Sensation recherchée :

**« Ah, je reconnais cet élément. Tout est relié. »**

Les liens doivent être **vrais**. Pour éviter les incohérences (cf. audit B2), centralise les données répétées (métriques, projets, technologies par projet) dans un seul objet JavaScript ou dans des attributs `data-` uniques, et fais-les lire par toutes les sections.

---

# 04 — CRÉE UNE MÉTAMORPHOSE MAJEURE

Au moins **une transformation inoubliable**.

Une vraie idée visuelle, pas une animation complexe pour être complexe.

### CONCEPT A

La capture de Tchakeda se décompose en ses zones fonctionnelles. Les zones deviennent des boîtes. Les boîtes s'alignent et deviennent le schéma d'architecture (client, API, sécurité, données). Puis tout se réassemble en capture.

### CONCEPT B

Une requête traverse toute la chaîne de Hady. Elle naît comme un **clic dans Angular**, devient un **appel REST**, passe la **vérification JWT**, atteint **une seule ligne de MySQL** filtrée par `tenant_id`, est **mise en cache par Redis**, et revient comme une **réponse affichée à l'écran**. Le trajet entier tient en une ligne.

### CONCEPT C

Un commit devient une mise en production : `git push` → build → tests → image Docker → déploiement, le pipeline GitLab CI se trace étape par étape et se termine sur la vraie capture du produit en ligne.

Propose aussi des concepts complètement différents.

Je veux **5 idées originales** avant de choisir.

---

# 05 — RELIE LE SCHÉMA ET LE PRODUIT

Le travail de Hady a deux faces :

* **le schéma** : couches, flux, décisions, `tenant_id`, JWT, cache, pipeline ;
* **le produit** : des écrans utilisés par des entreprises, des coachs, des agriculteurs, des clients d'un e-wallet.

Explore comment le motion peut créer un pont :

une boîte du schéma devient une zone de l'écran.

Un écran devient un projet du portfolio.

Un projet devient une métrique réelle.

Une métrique devient une preuve de confiance.

Une preuve devient une prise de contact.

Cette chaîne pourrait être la **métaphore centrale** du site : *du schéma au produit, du produit à la confiance.*

---

# 06 — LE SITE DOIT « RESPIRER »

Revois toutes les sections et repère celles qui bougent trop.

Je veux intentionnellement :

**MOUVEMENT**

↓

**SILENCE**

↓

**MOUVEMENT**

↓

**SILENCE**

↓

**WOW**

↓

**CALME**

Le calme fait partie du design. Une section de témoignages entièrement immobile peut avoir plus d'impact qu'une démonstration.

Livre la carte du rythme : pour chaque section, son état (mouvement, silence, wow, calme) et ce qui y bouge exactement.

---

# 07 — MONTRE LA MAÎTRISE, PAS LE DÉCOR

Certaines animations doivent communiquer implicitement **la rigueur de Hady** :

* les étapes d'un flux s'enchaînent dans le bon ordre technique (jamais le cache avant la sécurité) ;
* une décision d'architecture se détache au moment où le visiteur lit son contexte ;
* un projet indique clairement s'il est **en production** ou **en développement** ;
* une certification se pose comme une validation, avec son lien de vérification visible ;
* le formulaire valide chaque champ proprement, sans jamais mentir sur l'envoi.

Sans aucune promesse au-delà du réel.

Le motion transmet simplement :

**« Ce développeur structure, décide et livre. »**

---

# 08 — UNE EXPÉRIENCE « SYSTÈME EN PRODUCTION »

Le site ne doit jamais sembler figé, mais tout ce qui « vit » doit être **vrai** :

* la pastille de disponibilité de « En ce moment » (seul élément en boucle du site) ;
* le statut des projets (en production, en cours) ;
* la date de dernière mise à jour du portfolio, si elle est réelle ;
* les éléments « En ce moment » qui décrivent le travail en cours.

Interdit : faux compteur de requêtes, faux uptime, faux logs, fausses notifications, statistiques GitHub présentées comme de l'activité « live » si elles ne le sont pas. Ce serait une donnée inventée, et un CTO le verra.

Impression recherchée :

> **« Pendant que je lis ce site, ses systèmes tournent quelque part. »**

---

# 09 — AJOUTE QUELQUES « EASTER EGGS »

Pas des gadgets. De petits détails que seuls certains visiteurs remarqueront.

Pistes :

* survoler la métrique d'entreprises fait répondre une fois la grille multi-tenant ;
* survoler un tag de stack éclaire les projets qui l'utilisent ;
* rester sur le schéma d'un case study révèle la responsabilité de chaque couche ;
* **pour les développeurs qui ouvrent la console** : un message sobre, en une ligne, qui les invite à lire le code source ou à écrire (pas d'ASCII art, pas de blague forcée) ;
* un code source HTML propre et lisible, qui fait lui-même partie du portfolio.

Trois ou quatre au maximum. Jamais une information indispensable.

---

# 10 — CURSEUR INTELLIGENT

Pas de curseur spectaculaire.

Un **outil d'interrogation**, uniquement là où il apporte quelque chose :

curseur → révèle (la responsabilité d'une couche du schéma)

curseur → relie (un tag de stack et les projets qui l'utilisent)

curseur → éclaire (une décision et la partie du schéma qu'elle concerne)

curseur → déclenche une micro-réaction (le CTA principal)

Chaque révélation au curseur a un équivalent clavier (focus) et tactile (appui). Sur pointeur grossier, rien ne dépend du survol.

---

# 11 — SCROLL AS CAMERA

Challenge encore le scroll.

Je veux quelques moments où le visiteur a la sensation de **passer d'un système à l'autre** (Tchakeda → Smart Agro → AfriCred), plutôt que de descendre une page.

Par exemple : le schéma de Tchakeda se recompose en celui de Smart Agro (un client devient deux, Angular + Ionic, qui convergent vers la même API). Même vocabulaire, autre système.

Mais le scroll reste natif, rien n'est verrouillé, tout reste accessible par ancre et au clavier.

---

# 12 — UNE « SIGNATURE TRANSITION »

Une transition qui devient la marque visuelle du site, réutilisable :

hero → section

section → section

carte projet → case study

section → contact

Elle doit être :

* reconnaissable ;
* simple ;
* élégante ;
* techniquement intéressante ;
* impossible à confondre avec un template.

Piste existante à évaluer : **« le flux »** — le filet d'accent se trace d'abord, un court segment le parcourt une fois (la requête), puis le titre monte depuis cette ligne comme une réponse qui arrive.

Une seule bonne transition signature vaut mieux que dix différentes. Documente-la comme un composant : classe CSS, attributs, durées, version mouvement réduit.

---

# 13 — LE RETOUR COMME PARTITION

Un site de développeur parle déjà le langage des réponses : `200`, `201`, `401`, `422`.

Conçois les **retours de l'interface** comme une partition cohérente :

* chaque action du visiteur a une réponse visuelle de même famille (durée, courbe, forme) ;
* les messages du formulaire sont écrits avec soin, en FR et en EN (succès, champ invalide, erreur réseau avec repli vers l'email) ;
* le bouton copier, le changement de langue, l'ouverture d'un case study et l'envoi du formulaire partagent le même vocabulaire de retour ;
* les silences (aucun retour quand rien ne s'est passé) sont aussi intentionnels.

**Son** : piste conceptuelle uniquement. Pas de son sur ce site, jamais lancé automatiquement. Si une idée sonore te semble forte, décris-la pour une éventuelle vidéo de présentation, sans l'implémenter.

---

# 14 — UN MOMENT « WOW » AVEC PRESQUE RIEN

Une idée spectaculaire réalisée avec très peu d'éléments.

Par exemple :

un seul filet d'accent.

Il naît sous le nom de Hady.

Il devient la ligne du flux de requête.

Il traverse Spring Security et touche une seule cellule de tenant.

Il devient le trait qui barre une mauvaise pratique.

Il devient la ligne du parcours.

Puis il devient le soulignement du bouton « Envoyer le message ».

Et tout s'arrête.

Le visiteur réalise que **cette même ligne était présente depuis le début**.

Trouve plusieurs idées de ce type, puis choisis-en une.

---

# 15 — PENSE COMME UN FILM

Donne au site une structure émotionnelle :

### ACTE I — Découverte

« Qui est Hady ? »

Hero et profil.

### ACTE II — Compréhension

« Ah, il tient toute la chaîne, du front au déploiement. »

Le flux de requête.

### ACTE III — Émerveillement

« Regardez comment Tchakeda isole ses entreprises. »

Le moment multi-tenant et les case studies.

### ACTE IV — Confiance

« Il a des principes, des certifications vérifiables, des collègues qui le recommandent. »

Standards, parcours, certifications, témoignages.

### ACTE V — Action

« Je veux lui parler de mon projet. »

En ce moment, contact.

Le motion accompagne cette progression : plus démonstratif en acte III, presque immobile en acte IV, net et direct en acte V.

---

# 16 — LE MOMENT DE CONFIANCE

Après les moments les plus démonstratifs, un moment **beaucoup plus calme**.

Hady doit paraître :

**stable, fiable, expérimenté.**

Pas seulement créatif.

C'est essentiel pour quelqu'un à qui l'on confie une architecture, une équipe ou des données d'entreprise.

Appuie-toi uniquement sur des preuves réelles :

* Software Architecture *with Distinction*, University of Alberta, avec lien de vérification ;
* Spring MVC, LearnQuest, avec lien de vérification ;
* rôle actuel de Responsable du Département Développement ;
* témoignages nominatifs existants ;
* la section Standards.

Le visiteur doit ressentir :

**WOW + CONFIANCE**

et pas seulement **WOW**.

---

# 17 — FINIR PLUS FORT QU'ON NE COMMENCE

Revois complètement la section contact.

Le site doit se terminer sur :

**« Maintenant, j'ai compris. »**

Le dernier moment rappelle subtilement le concept du début et ferme la boucle.

Proposition :

le visiteur rédige son message. Au clic sur « Envoyer », le même petit segment que dans le hero parcourt le filet sous le bouton : **c'est maintenant sa requête à lui qui circule.** Si l'envoi réussit réellement, la réponse se pose (« Message reçu, je vous réponds sous 24 h »). Si l'envoi échoue, le retour est honnête et propose l'email direct.

Le flux tracé tout au long du site trouve son dernier nœud : **votre projet**.

---

# 18 — CRÉE UNE BOUCLE NARRATIVE

Le début et la fin doivent être liés :

**HERO → FLUX → CONTACT**

Quelque chose du début revient à la fin, transformé.

Le visiteur doit sentir, presque inconsciemment :

**« Ce site a été pensé de bout en bout, comme ses systèmes. »**

---

# 19 — PASSE « LESS BUT BETTER »

Après avoir imaginé toutes ces idées :

**supprime 20 à 30 % des animations actuelles** si elles sont redondantes ou inutiles.

Candidats à examiner en priorité :

* toute révélation au scroll restante sur des blocs de texte simples ;
* les entrées animées dans la stack, les certifications et les témoignages ;
* les compteurs qui ne servent pas la narration ;
* les effets de survol qui se ressemblent sans se répondre ;
* la barre de progression de scroll ;
* toute animation de la sidebar ;
* tout ce qui rejoue au changement de langue.

La V3 doit être :

**plus impressionnante ET plus simple.**

La sophistication ne vient pas de la quantité. Elle vient de la sélection.

Livre la liste de ce que tu supprimes, avec une ligne de justification pour chaque suppression.

---

# 20 — PERFORMANCE ET ACCESSIBILITÉ

Tout doit rester réaliste pour un site statique sur GitHub Pages.

Prévoir :

* desktop, tablette, mobile (390 px sans débordement horizontal) ;
* `prefers-reduced-motion` : tout le contenu visible immédiatement, chaque moment fort remplacé par son état final statique ;
* connexions faibles : aucune animation n'attend un asset lourd, images WebP en lazy loading ;
* appareils modestes : pas de boucle `requestAnimationFrame` permanente, animations stoppées hors viewport ;
* clavier et lecteur d'écran : ordre de focus logique, modales et pages de case study navigables, schémas SVG avec un texte équivalent ;
* changement de langue FR / EN sans saut de mise en page ni animation rejouée.

Si une idée coûte beaucoup pour un bénéfice faible : **supprime-la.**

Si elle peut être faite intelligemment en CSS / SVG / Canvas léger en JS vanilla : privilégie cette solution. Pas de WebGL, de GSAP ni de Three.js sans décision explicite de Hady.

Mesure avant / après : poids de la page, nombre de scripts, score Lighthouse mobile (performance et accessibilité).

---

# TON PROCESSUS

Avant toute modification, fais un **audit créatif** de la version actuelle (site et code), en t'appuyant sur `improve-animations`.

### 5 choses déjà excellentes

### 5 choses encore améliorables

### 5 opportunités non exploitées

### 5 idées totalement nouvelles

Puis crée **3 directions créatives possibles pour la V3**.

Pour chaque direction :

* concept ;
* émotion ;
* narration ;
* signature visuelle ;
* moment WOW ;
* difficulté ;
* impact sur la compréhension du profil ;
* impact sur la prise de contact ;
* risque de surcharge.

Choisis la direction qui offre le meilleur équilibre entre :

**WOW + CLARTÉ + PRISE DE CONTACT + PERFORMANCE + IDENTITÉ HADY**

Présente ton choix, puis implémente-le.

---

# RÈGLE FINALE

Ne demande pas :

> « Quel nouvel effet pouvons-nous ajouter ? »

Demande :

> **« Quelle idée peut faire ressentir à un recruteur quelque chose qu'il n'a jamais ressenti sur un portfolio de développeur ? »**

Le site de Hady doit avoir :

**son propre langage,
son propre rythme,
sa propre signature,
son propre univers.**

Assez beau pour impressionner un designer,

assez clair pour convaincre un CTO en 30 secondes,

assez rapide pour s'ouvrir instantanément sur un téléphone à Bamako.

**Surprends-moi.**
