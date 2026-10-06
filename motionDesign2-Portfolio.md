La première version est en place.

Je veux maintenant une **deuxième passe beaucoup plus ambitieuse**, comme si un directeur créatif senior reprenait le portfolio de Hady Fofana avant qu'il ne soit envoyé à des CTO, à des équipes produit internationales et à un jury de design.

**Ne te contente surtout pas d'ajouter des effets.**

Identifie ce qui rendrait l'expérience **plus mémorable, plus personnelle, plus surprenante**, tout en restant sobre, crédible pour un profil backend senior et rapide sur mobile.

Le but n'est pas d'avoir plus d'animations.

Le but est d'avoir **de meilleures idées.**

Rappels permanents :

* `AUDIT-Portfolio.md` reste la référence (contenu réel, bloquants, décisions de Hady) ;
* les tokens créés en V1 dans `:root` sont la seule source des durées, courbes et couleurs ;
* HTML / CSS / JavaScript vanilla, GitHub Pages, aucune librairie ajoutée sans accord ;
* charge `emil-design-eng`, `apple-design` et `animate` avant de proposer, `review-animations` avant de livrer ;
* aucune idée ne justifie d'inventer une métrique, un client ou une fonctionnalité.

---

# 1. CRÉE UNE « SIGNATURE MOTION » HADY FOFANA

Imagine quelqu'un qui voit 5 secondes d'animation sans voir le nom.

Il doit pouvoir sentir :

**« C'est le site de Hady. »**

Trouve un principe visuel propre, tiré de **son vrai métier** : requêtes, couches, isolation, pipelines, décisions argumentées.

Pistes de départ :

* **le flux** : un filet de 1 px qui précède toujours ce qu'il annonce, et sur lequel un petit segment (la requête) circule une seule fois, de gauche à droite ;
* **les couches** : les éléments arrivent empilés dans l'ordre d'une architecture (présentation → service → données), jamais en vrac ;
* **l'isolation** : chaque élément reste dans son couloir, rien ne déborde sur le voisin, comme un tenant ;
* **le diff** : ce qui change est marqué avant d'être remplacé, comme une revue de code ;
* **la réponse** : chaque action du visiteur reçoit un retour net et court, comme un `200 OK`.

Mais invente quelque chose d'original. Ne copie ni Linear, ni Vercel, ni Stripe.

Teste ta signature avec une question simple : *est-ce qu'un développeur Java reconnaîtrait son propre métier dans ce mouvement ?*

---

# 2. AJOUTE UNE VRAIE NARRATION

Le site doit raconter une histoire sans l'expliquer.

**PROBLÈME → ARCHITECTURE → CODE → PRODUCTION**

Au début :

un besoin réel. Des PME maliennes sans outil adapté. Des agriculteurs sans conseil fiable. Une institution financière qui veut un e-wallet.

Puis Hady intervient.

Les premières boîtes du schéma apparaissent.

Les décisions se prennent (shared schema, Redis, JWT).

Le code devient un produit.

À la fin :

on voit un système en production, utilisé par de vraies entreprises, déployé par un pipeline.

Le motion s'appuie uniquement sur les contextes, schémas et décisions déjà écrits dans les case studies.

---

# 3. LE « MOMENT IMPOSSIBLE »

Un moment qu'on n'attend pas sur un portfolio de développeur.

Quelque chose qui fait dire :

> « Attends… il a vraiment fait ça ? »

Exemple de direction :

**le schéma devient le produit.**

Le diagramme `Angular → Spring Boot → MySQL` se dessine sur fond sombre.

Les boîtes prennent de l'épaisseur.

Elles glissent et se redimensionnent jusqu'à épouser exactement les zones de la vraie capture de Tchakeda (barre de navigation, panneau de données, en-tête).

Le schéma s'efface : il ne reste que l'interface réelle.

OU trouve mieux.

Propose **3 concepts différents** avant d'en retenir un. Autres graines possibles :

* **la page se dés-assemble** : au passage d'une section clé, sa structure (grille, blocs, espacements) apparaît une fraction de seconde en mode « fil de fer », puis le rendu final revient. On voit l'architecture du site comme on voit celle d'un système ;
* **la requête traverse le site** : le clic sur « Voir mes projets » lance le petit segment du flux, qui descend la page et s'arrête exactement sur la carte Tchakeda.

Le concept retenu doit rester sobre, réalisable en CSS / SVG / JS vanilla, et entièrement remplaçable par une image statique en mouvement réduit.

---

# 4. DONNE L'IMPRESSION QUE LA REQUÊTE CIRCULE

Hady n'est pas « un front » ou « un back ». Il tient **toute la chaîne**.

ANGULAR / IONIC (client)
↓
SPRING BOOT (controller → service)
↓
SPRING SECURITY (JWT, `tenant_id`)
↓
MYSQL (données isolées)
↓
REDIS (cache)
↓
DOCKER + GITLAB CI (production)

La requête doit parfois circuler visuellement d'une couche à l'autre, ou d'une section à la suivante.

Pas partout.

À **deux ou trois** moments stratégiques seulement : le hero ou le profil, la carte Tchakeda, le contact.

Le visiteur doit comprendre intuitivement :

**« Un seul développeur, du clic utilisateur jusqu'à la mise en production. »**

---

# 5. AJOUTE DE LA PROFONDEUR

### Niveau 1

Le contenu (textes, métriques, liens).

### Niveau 2

Les captures des produits réels.

### Niveau 3

Le schéma d'architecture (couches, flux, `tenant_id`).

### Niveau 4

Le mouvement.

### Niveau 5

La profondeur (superposition, échelle, focus).

Je veux quelques moments où l'on a l'impression de **regarder à l'intérieur du produit**, pas seulement sa vitrine : la capture devient translucide et le schéma apparaît derrière, puis tout revient.

Pas de 3D gratuite, pas de rotation de carte, pas de tilt au curseur.

---

# 6. UTILISE LE SCROLL COMME UNE CAMÉRA

Pas seulement :

**section suivante → section suivante → section suivante**

Plutôt :

SCROLL DOWN
→ vue d'ensemble de la chaîne (toutes les couches)

SCROLL DOWN
→ zoom sur une couche (Spring Security et l'isolation)

SCROLL DOWN
→ sortie vers le produit réel (capture Tchakeda)

SCROLL DOWN
→ recul vers les principes (Standards)

SCROLL DOWN
→ preuve extérieure (certifications, témoignages)

Une sensation de **visite guidée d'un système**.

Mais :

* le scroll reste natif, jamais détourné ;
* pas de section épinglée sur mobile ;
* aucune séquence épinglée de plus d'une hauteur d'écran sur desktop ;
* tout le contenu est lisible si le visiteur fait défiler très vite ou saute avec une ancre.

---

# 7. AJOUTE DES « DISCOVERABLE DETAILS »

Des détails qu'on ne remarque pas au premier regard, mais qui récompensent ceux qui restent.

Pistes, toutes fondées sur des liens **réels** du contenu :

* survoler (ou focaliser) un tag de la stack, par exemple `Redis`, met discrètement en évidence les projets qui l'utilisent vraiment ;
* survoler la métrique d'entreprises fait pulser une fois la grille multi-tenant ;
* survoler un refus de la section Standards affiche en légende le projet où cette règle est appliquée (ex. « Multi-tenant sans isolation » → Tchakeda) ;
* la pastille « En ce moment » réagit une fois quand le visiteur arrive sur la section ;
* l'adresse email copiée laisse une coche discrète pendant deux secondes.

Ces détails ne portent **jamais** une information indispensable. Chacun a un équivalent clavier (focus) et tactile.

---

# 8. INTRODUIS DU « SILENCE »

Après une séquence forte :

**STOP.**

Une composition presque immobile.

Les certifications. Les témoignages. Du blanc, du texte, aucune entrée animée.

Puis un seul mouvement extrêmement précis (le lien « Vérifier » qui se souligne, par exemple).

Le contraste rend les moments précédents plus forts.

**Des moments de démonstration + des moments de silence.**

---

# 9. CURSEUR / INTERACTION

Pas de curseur personnalisé, pas de rond qui suit la souris.

Mais le curseur peut parfois **interroger le système** :

* une couche du schéma s'éclaire au survol, avec sa responsabilité en une ligne ;
* une cellule de la grille multi-tenant montre son `tenant_id` (fictif et marqué comme tel, ou simplement un index) ;
* une décision du case study souligne la partie du schéma qu'elle concerne.

Le visiteur doit sentir :

**« Le site me répond, comme une API bien documentée. »**

Uniquement sur pointeur fin, toujours doublé au clavier et au toucher.

---

# 10. AJOUTE UNE TRANSITION « MAGIQUE »

Au moins **une transition que l'on ne comprend pas immédiatement**.

Option A : la carte Tchakeda s'agrandit, sa capture devient l'en-tête plein écran du case study… qui était en réalité déjà une page dédiée (`tchakeda.html` + View Transitions API entre documents, avec repli sans transition).

Option B : le filet d'accent sous le titre « Projets » s'allonge, devient la ligne du flux de requête, le flux arrive à MySQL, et la même ligne devient le soulignement du titre « Standards ».

Option C : invente mieux.

---

# 11. FAIS DIALOGUER LE DESIGN SYSTEM ET LE MOTION

Le motion respecte :

* la couleur d'accent unique et les fonds sombre / clair ;
* Inter et la monospace réservée aux termes techniques ;
* les rayons de 6 à 12 px et les filets de 1 px ;
* les captures produit ;
* le schéma `cs-stack-flow`.

Mais il peut **déformer brièvement le design system** pour un moment fort : la page passe en vue « schéma » (fond sombre, boîtes en fil de fer, libellés monospace), puis revient immédiatement à l'interface normale.

Cette tension :

**interface → architecture → interface**

peut devenir la signature du site.

---

# 12. UN HERO PLUS FORT

Les premières secondes doivent donner :

**rigueur + étendue + précision**

Pas seulement :

« Voici un nom et une photo. »

Trouve une manière de montrer que plusieurs couches techniques sont réunies chez une seule personne.

Par exemple : cinq libellés monospace (`Angular`, `Spring Boot`, `Security`, `MySQL`, `CI/CD`) apparaissent alignés sur le filet, puis se resserrent en une seule ligne continue sous le nom de Hady, et ne bougent plus.

C'est un exemple. Trouve plus fort, plus simple.

Contraintes non négociables : nom, rôle et CTA visibles dès le premier rendu (LCP), séquence terminée en moins d'une seconde, aucune boucle.

---

# 13. UN MOMENT « SATISFYING »

Au moins une animation qu'on a envie de revoir.

Pistes :

* toutes les lignes du flux se tracent en parallèle et **se terminent exactement au même instant** ;
* la grille multi-tenant se remplit cellule par cellule en vague diagonale, puis une seule cellule répond ;
* les six refus de la section Standards se valident l'un après l'autre comme des tests qui passent ;
* la ligne du parcours se trace et chaque poste s'y accroche avec un léger « clic » visuel.

Sensation recherchée : **précision mécanique, zéro mollesse.**

---

# 14. NE SURCHARGE PAS

Probablement la règle la plus importante.

**3 moments mémorables** plutôt que **30 effets moyens.**

Attribue à chaque section un rôle :

### WOW
Très fort, rare.

### FLOW
Fluide, guide la lecture.

### CALM
Minimal, presque immobile.

### SIGNATURE
Le geste reconnaissable.

Un portfolio de développeur senior doit rester sérieux : la démonstration est l'exception, la lisibilité est la règle.

---

# 15. CHALLENGE TA PREMIÈRE VERSION

Avant de toucher au code, relis la V1 (`assets/js/motion.js`, le bloc `:root`, les règles motion dans `style.css`, le HTML du hero, des projets et du case study) et réponds honnêtement :

* Qu'est-ce qui ressemble encore à iPortfolio ou à un template Bootstrap ?
* Qu'est-ce qui est prévisible ?
* Où le visiteur ne comprend-il toujours pas ce que Hady fait de différent ?
* Où pourrait-on supprimer une animation ?
* Où pourrait-on remplacer trois animations par une idée plus forte ?
* Le moment multi-tenant est-il vraiment compris sans légende ?
* Le case study est-il encore trop caché ?
* Quel élément pourrait devenir la signature de Hady ?

Sois **critique envers ton propre travail.**

---

# LIVRABLE

Ne commence pas par ajouter des animations.

Propose d'abord :

### A. 5 idées de « WOW MOMENTS »

Pour chacune : concept, description, transition, émotion recherchée, difficulté technique, poids ajouté (Ko), impact sur l'expérience.

### B. 3 concepts de « SIGNATURE MOTION »

### C. 3 idées de transitions impossibles

### D. Une nouvelle narration globale (ordre des sections + rôle WOW / FLOW / CALM / SIGNATURE de chacune)

Puis sélectionne les idées qui forment **l'expérience la plus cohérente**, explique ce que tu écartes et pourquoi, et implémente-les : page d'accueil d'abord, puis case studies.

Vérifie en fin de passe : mobile 390 px sans débordement, navigation complète au clavier, mouvement réduit, poids total de la page.

---

# RÈGLE ABSOLUE

Je ne veux pas que ce portfolio ressemble à :

**« un template de développeur avec de belles animations. »**

Je veux qu'il ressemble à :

**« le travail d'un architecte logiciel qui a son propre langage. »**

Le visiteur ne doit pas seulement lire les compétences de Hady.

Il doit **ressentir sa rigueur.**

**Plus d'idées.
Moins d'effets.
Plus de personnalité.
Plus de surprise.
Plus de précision.**

Et surtout :

**crée au moins un moment dont un recruteur parlera à son équipe après avoir fermé l'onglet.**
