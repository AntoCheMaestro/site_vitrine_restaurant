# 🍽️ Site vitrine restaurant — thème (Bistro / Gastro / Street)

Je suis parti d’un besoin simple : avoir un **site vitrine statique**,  **réutilisable pour différents clients** sans réécrire tout le design.

Ce repo est donc une base “portfolio” : tu peux changer le **style** (bistro chic / gastro / street) en 1 clic, et le site adapte automatiquement **couleurs, ambiance visuelle et contenus**.

---

## ✨ Ce que le site fait 
### 🎨 3 styles de site
Un sélecteur **Style** dans le header applique un thème :
- **Bistro chic** : chaud, cosy, doré
- **Gastro** : premium sobre, minimal
- **Street** : plus punchy, contrasté

Le choix reste actif en changeant de page.

### 📱 Conversion mobile (pro)
- **Barre sticky mobile** en bas de l’écran :
  - **Réserver**
  - **Appeler**
  - **Itinéraire**

### 🕒 Horaires intelligents
Affiche automatiquement :
- **“Ouvert — ferme à 22:30”** si ouvert
- **“Fermé — ouvre aujourd’hui à 19:00”** si ça réouvre plus tard
- **“Fermé — ouvre demain…”** sinon

### 🍽️ Menu dynamique + filtres
Le menu est généré depuis une config JS :
- Entrées / Plats / Desserts / Boissons
- Filtres par catégorie

### ⭐ Avis (démo)
Une section avis (d’exemple) pour crédibiliser la vitrine, avec bouton “Voir sur Google Maps”.

### ⚡ Perf / polices
Google Fonts + `preconnect` + bonnes pratiques de chargement de polices.

---

## 🧩 Architecture

Le projet est volontairement **simple**, sans framework :

- `index.html` → accueil (hero, highlights, avis)
- `menu.html` → menu + filtres
- `contact.html` → réservation, accès, carte, formulaire (démo)
- `css/main.css` → design system + thèmes
- `js/main.js` → config + thème + horaires + menu + sticky CTA

Objectif : **une base statique clean** et facile à personnaliser.

---

## 📂 Structure du projet

```text
site_vitrine_restaurant/
│
├── index.html
├── menu.html
├── contact.html
│
├── css/
│   └── main.css
│
├── js/
│   └── main.js
│
└── legal/
    ├── mentions-legales.html
    └── politique-confidentialite.html
```
---

## 👤 Auteur

Projet réalisé dans un objectif d’apprentissage et de portfolio e-commerce front-end.

