# 🧾 Commande Opti-W

Application professionnelle de gestion et de suivi des commandes pour les magasins **Opti-W** (Laval, Rosemère, Blainville) et le laboratoire.

---

## 🧰 Fonctionnalités principales

- 🔒 Connexion sécurisée par rôle avec interface personnalisée :
  - **Employés magasins** (Laval, Rosemère, Blainville) → voient et gèrent uniquement leurs commandes
  - **Laboratoire** → accès à toutes les commandes avec mention du magasin d’origine
  - **Admin** → accès complet à toutes les commandes, tous les rôles, filtres, éditions

- 📦 Tableau de commandes avec :
  - Statut
  - Date de création
  - Commentaire modifiable
  - ✅ Code de suivi client

- 🔔 Alerte visuelle des délais :
  - **10 jours** → fond jaune
  - **14 jours** → fond rouge

- 🛠️ Actions disponibles :
  - Ajouter / Modifier / Supprimer une commande
  - Modifier le statut
  - Ajouter un commentaire
  - Filtrer par magasin (admin)

- 🌐 **Suivi public client** :
  - Formulaire de tracking via code
  - Affiche statut, commentaire et date de commande

- 💡 **Interface responsive (mobile + desktop)** :
  - Promotions adaptées : affichage côte à côte sur desktop, superposées sur mobile
  - Bouton **"Où nous trouver"** et cartes Google Maps intégrées
  - Section **parrainage client avec génération de code barre** imprimable
  - Section promotions avec modales vidéo + image explicative

- 📤 **Notifications Email (via EmailJS)** :
  - Lors du changement de statut d'une commande

- ⚙️ **Progressive Web App (PWA)** :
  - Service Worker actif (`serviceWorkerRegistration.js`)
  - Mise en cache des fichiers pour une meilleure performance

---

## 👥 Comptes de test (connexion)

| Email                 | Mot de passe     | Rôle        |
|----------------------|------------------|-------------|
| laval@optiw.com       | LavalOpti2025!   | Laval       |
| rosemere@optiw.com    | RoseOpti2025!    | Rosemère    |
| blainville@optiw.com  | BlainOpti2025!   | Blainville  |
| labo@optiw.com        | LaboSecure2025!  | Laboratoire |
| admin@optiw.com       | Admin#2025Opti   | Admin       |
| reference@optiw.com   | RefOpti2025!     | Référence   |

---

## 🛒 Modules intégrés

- 📍 **Magasins et cartes** : intégration de Google Maps pour chaque succursale
- 🎁 **Promotions avec modales vidéo explicatives** (2x200$ / 2x300$)
- 🧑‍🤝‍🧑 **Système de parrainage client** :
  - Formulaire de parrainage (nom, prénom, téléphone, email)
  - Génération de **code promo unique** avec **code-barres imprimable**
  - Suivi des parrainages via rôle `référence`
  - Interface de gestion et recherche de code

---

## 💻 Technologies utilisées

- **React.js** (framework principal)
- **EmailJS** (envoi automatique de mail)
- **JsBarcode** (génération de code-barres)
- **LocalStorage** (stockage temporaire des données)
- **Vercel** (hébergement)
- **CSS personnalisé** + media queries

---

## 🚀 Déploiement

Déployé automatiquement via [Vercel](https://vercel.com/) (framework React requis).

### 📁 Structure du projet

```bash
📦 src
 ┣ 📄 App.js
 ┣ 📄 LoginView.js
 ┣ 📄 MainApp.js
 ┣ 📄 Tracking.js
 ┣ 📄 Parrainage.js
 ┣ 📄 serviceWorkerRegistration.js
 ┣ 📄 index.js
 ┣ 📄 index.css
