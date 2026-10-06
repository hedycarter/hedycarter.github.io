# Audit UI & Motion — Portfolio Hady Fofana

Date : 5 octobre 2026
Périmètre : `index.html`, `assets/css/style.css`, `assets/css/style2.css`, `assets/js/main.js`, vendors chargés, rendu desktop (1440 × 900) et mobile (390 × 844).

Ce document est la **source de vérité** des trois briefs motion (`motionDesign1-Portfolio.md`, `motionDesign2-Portfolio.md`, `motionDesign3-Portfolio.md`). Tout agent qui implémente un brief le lit d'abord.

---

## 0. Verdict en une phrase

Le **contenu** est au niveau d'un développeur senior (case studies avec de vraies décisions d'architecture, une section « Ce que je refuse de faire » rare et forte, des métriques de production), mais l'**enveloppe** est encore celle du template BootstrapMade *iPortfolio* : sidebar sombre, hero « nom + typewriter + photo ronde », reveals AOS partout, cartes qui se retournent au survol. Un recruteur technique reconnaît le template avant de lire le contenu.

L'objectif des briefs : **que la forme raconte enfin ce que le fond prouve.**

---

## 1. Bloquants à corriger avant tout travail de motion

| # | Problème | Où | Impact |
|---|---|---|---|
| B1 | **Le formulaire de contact ne peut pas fonctionner** : clés EmailJS laissées à `YOUR_PUBLIC_KEY` / `YOUR_SERVICE_ID` / `YOUR_TEMPLATE_ID`. Chaque envoi tombe dans le message d'erreur. | `index.html:1799-1801` | Perte directe de prospects. |
| B2 | **Métriques incohérentes** : `183` entreprises / `330` utilisateurs dans les compteurs (profil + case study), `214+` / `381+` dans les textes, l'OG et les traductions. Le case study écrit même « migrations sur 214+ bases, maintenance x183 ». | `index.html:208,214,1152,1156` vs `240,344,740,1204,1453…` | Un CTO qui remarque l'écart doute de tout le reste. **Chiffre à trancher par Hady.** |
| B3 | **Débordement horizontal sur mobile** : les deux CTA du hero ne passent pas à la ligne, « Télécharger le CV » est coupé et la page scrolle latéralement. | `.hero-ctas`, capture mobile | Première impression cassée sur le support le plus utilisé par les recruteurs. |
| B4 | **Lien de navigation mort** : « Références » pointe vers `#services`, qui n'existe pas. | `index.html:146` | Navigation qui ne répond pas. |
| B5 | **Vidéo de 16 Mo en autoplay** dans la grille projets (`portofolio-11.mp4`), plus des SVG de 2,4 à 5 Mo (`1.svg`, `2.svg`) utilisés comme vignettes. | `index.html:843,867,877` | Poids de page énorme, surtout sur réseau mobile malien. |
| B6 | **Aucun `prefers-reduced-motion`** dans tout le CSS ; aucun style `:focus-visible` hors navigation et champs du formulaire. | `style.css` | Accessibilité (WCAG 2.2 AA) non respectée. |

---

## 2. Cinq choses déjà excellentes (à protéger)

1. **Les case studies Tchakeda et Smart Agro** : contexte → architecture → décisions clés (shared schema vs schema-per-tenant, Redis à 15 min sur les permissions, JWT portant `tenant_id`). C'est le contenu le plus différenciant du site, et il est caché dans une modale.
2. **« Standards · Ce que je refuse de faire »** : six refus argumentés (logique dans les controllers, credentials en dur, multi-tenant sans isolation…). Presque aucun portfolio n'a ça. C'est une prise de position, donc une personnalité.
3. **Le schéma `cs-stack-flow`** (`Angular → Spring Boot + JWT → MySQL tenant_id + Redis + Docker/GitLab CI`) : la future signature visuelle du site existe déjà, en HTML, dans la modale.
4. **Des métriques réelles de production** (entreprises, utilisateurs) plutôt que des pourcentages de compétences.
5. **Les détails « humains »** : section « En ce moment », bouton copier l'email avec retour visuel, site bilingue FR/EN, certificats vérifiables par lien Coursera.

---

## 3. Cinq problèmes UI à corriger

1. **Hiérarchie narrative inversée.** L'ordre actuel est Profil → Formations → Certifications → Stack → Standards → **Projets** → Témoignages → Now → Contact. La preuve la plus forte (Tchakeda en production) arrive en 6ᵉ position. Le rôle actuel (Responsable du Département Développement) est rangé sous un onglet « Formations ».
2. **Hero sans proposition de valeur.** Nom + « Développeur Full Stack » + texte qui se tape tout seul. Le badge « Responsable Développement · Groupe Xpert Pro » est commenté. Rien ne dit en 3 secondes : *j'architecture des SaaS multi-tenant en production*.
3. **Signature visuelle de template.** Sidebar fixe de 300 px avec photo ronde (template iPortfolio), même photo affichée **trois fois** au-dessus de la ligne de flottaison et juste après (sidebar, hero, profil), anneaux décoratifs, glow bleu, grille de points en fond.
4. **Typographie et couleur dispersées.** Quatre familles (Poppins ×28, Inter ×15+, Raleway, Georgia) plus Arial dans `style2.css`. Le bleu `#149ddd` est celui du template, utilisé 47 fois, avec en plus du vert, du rouge `#ce0033`, du jaune, et les couleurs propres à chaque logo de certification. Aucun token (`:root` vide).
5. **Projets dupliqués et mal présentés.** Tchakeda et Smart Agro apparaissent dans un carrousel Swiper de deux diapositives (le second projet est donc caché) **puis** à nouveau dans la grille en dessous. La grille montre des captures sans titre visible : toute l'information est dans l'attribut `title` de la lightbox. Un filtre Isotope pour sept éléments.

---

## 4. Audit du motion actuel

| Élément | Comportement | Verdict |
|---|---|---|
| AOS (`data-aos` × 17) | `duration: 1000`, `ease-in-out`, fade-up/left/right sur presque chaque bloc | **Trop lent, trop uniforme.** 1 s en ease-in-out paraît mou. Tout apparaît de la même façon → plus rien n'est mis en valeur. |
| Typed.js dans le hero | Boucle infinie qui tape / efface six expressions | **Cliché n° 1 des portfolios de développeur.** Contenu jamais lisible en entier, pas d'arrêt, illisible pour les lecteurs d'écran. Redémarre à chaque changement de langue. |
| Curseur `|` clignotant | `step-end infinite` | Mouvement perpétuel sans information. |
| Cartes certifications | Retournement 3D au **survol** | **Inaccessible** : le lien « Vérifier » n'existe qu'au verso, donc invisible au clavier et sur mobile. Information cachée derrière une animation. |
| PureCounter | Compte de 0 à 1, de 0 à 2, et **de 0 à 0** (« Incident de déploiement ») | Compter jusqu'à 1 est un effet PowerPoint ; compter jusqu'à 0 est une animation vide. Seuls les grands nombres méritent un comptage. |
| Barre de progression du scroll | Dégradé bleu, `transition: width 0.08s linear` animée via `width` | Gadget, et `width` déclenche un reflow à chaque scroll. |
| Pastilles « live » qui pulsent | `avail-pulse` infini dans « En ce moment » | Acceptable si unique et justifié ; à garder comme seul signal « vivant ». |
| Swiper projets | Glissement 500 ms, flèches + points | Carrousel pour deux éléments = contenu caché. |
| Modales case study | Opacité + transform 220 ms `cubic-bezier(0.23,1,0.32,1)` | **La meilleure courbe du site.** Mais : pas de piège de focus, focus non restitué à la fermeture, aucune continuité visuelle entre la carte cliquée et la modale. |
| Hover global | `transition: all` dans plusieurs règles, durées entre 0,12 s et 0,9 s sans logique | Pas de système. |
| `main2.js` (particles.js) et `style2.css` (animations « lightning / boom ») | Non chargés pour l'un, CSS mort pour l'autre | Code mort à supprimer. |

---

## 5. Cinq opportunités non exploitées

1. **La requête comme fil conducteur.** Le métier de Hady, c'est faire circuler une requête proprement : client → API → sécurité → données → cache → déploiement. Le site peut être construit sur ce trajet.
2. **L'isolation multi-tenant comme image.** « 183 (ou 214) entreprises, une seule instance, aucune donnée croisée » est un concept visuel parfait : une grille de cellules, une requête, une seule cellule qui répond.
3. **Les refus comme diff.** La section Standards peut se lire comme une revue de code : la mauvaise pratique est barrée, la bonne apparaît. C'est le langage naturel d'un développeur, pas une décoration.
4. **Le case study comme page, pas comme modale.** Une transition à élément partagé (la capture de la carte devient l'en-tête du case study) rendrait le contenu le plus fort du site impossible à manquer.
5. **Le formulaire de contact comme dernière requête.** Le visiteur envoie *sa* requête à Hady. La boucle narrative se referme, à condition que l'envoi fonctionne réellement (B1).

---

## 6. Ce qu'il faut supprimer

* Typed.js et le curseur clignotant.
* AOS sur chaque bloc (garder au maximum trois révélations intentionnelles par écran, en IntersectionObserver natif).
* Les compteurs de 0 à 0, de 0 à 1 et de 0 à 2 : afficher la valeur directement.
* Le retournement 3D des certifications au survol.
* Le carrousel Swiper à deux diapositives et le doublon dans la grille.
* La barre de progression de scroll (ou la refaire en `transform: scaleX`, si elle est conservée).
* `main2.js`, le bloc « animation-container / lightning / boom » de `style2.css`, `forms/contact.php` s'il n'est plus utilisé.
* Le second tag Google Analytics (`G-SJ9LFGJTX2` chargé mais jamais configuré).
* Les anneaux décoratifs, le glow et le dégradé de bordure autour de la photo du hero.

---

## 7. Dépendances JS chargées aujourd'hui

PureCounter, AOS, Bootstrap bundle, GLightbox, Isotope, Swiper, Typed.js, Waypoints, php-email-form/validate.js, EmailJS.

Objectif motion : **remplacer PureCounter, AOS, Typed, Waypoints et Isotope** par environ 150 lignes de JavaScript vanilla (IntersectionObserver + `requestAnimationFrame`). Garder GLightbox seulement si les captures en ont besoin. Swiper devient inutile si les projets ne sont plus en carrousel.

---

## 8. Décisions qui reviennent à Hady (à valider avant implémentation)

1. **Chiffres Tchakeda** : 183 / 330 ou 214 / 381 ? Date de la mesure ? Une seule valeur sera utilisée partout.
2. **Navigation** : garder la sidebar fixe (identité actuelle) ou passer à une barre supérieure compacte qui libère toute la largeur pour le contenu (recommandé).
3. **Ordre des sections** : adopter l'ordre narratif proposé dans `motionDesign1-Portfolio.md` (projets avant parcours).
4. **Typographie** : réduire à Inter (texte et titres) + une monospace (JetBrains Mono ou IBM Plex Mono) réservée aux vrais termes techniques.
5. **Couleur d'accent** : garder `#149ddd` ou choisir une teinte propre (voir brief 1, section Direction artistique).
6. **Clés EmailJS** : fournir les identifiants, ou basculer sur un `mailto:` assumé.
