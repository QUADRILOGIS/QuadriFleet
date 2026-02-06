# 🚴 QuadriFleet

<p align="center">
  <strong>Application web de gestion de flotte pour les remorques Quadrilogis</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-blue?logo=nextdotjs" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PrimeReact-10-green" alt="PrimeReact">
  <img src="https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss" alt="TailwindCSS">
</p>

---

## 👥 Équipe de développement

Cette application a été réalisée par une équipe de la **promotion FIL A2 2025/2026** de l'**IMT Atlantique** :

| Nom                         | Rôle                      |
| --------------------------- | ------------------------- |
| **Pacôme CAILLETEAU**       | Développeur Back          |
| **Nathaniel GUITTON**       | Concepteur BDD            |
| **Liam LE NY**              | Développeur Front Web     |
| **Baptiste BAYCHE**         | Développeur Front Web     |
| **Marina CARBONE**          | Designeuse                |
| **Camille GOUAULT--LAMOUR** | Développeuse Fullstack Mobile |

---

## 🎯 Objectif

QuadriFleet est l'application web destinée aux managers pour :

- suivre l'état de la flotte en temps réel
- visualiser les alertes et incidents
- consulter les statistiques d'exploitation
- gérer les paramètres de maintenance

---

## 🧱 Stack technique

- Next.js (App Router)
- TypeScript
- PrimeReact + TailwindCSS
- next-intl (i18n)

---

## 🔌 API QuadriCore

QuadriFleet consomme l’API **QuadriCore** pour l’authentification, les données de flotte,
les alertes, les incidents et les statistiques.

---

## 🚀 Installation

```bash
# Installer les dépendances
npm install
```

---

## ⚙️ Configuration

Créez un fichier `.env.local` à la racine du projet :

```env
API_BASE_URL="http://localhost:3001/api"
```

---

## 🏃 Lancement

```bash
# Mode développement
npm run dev

# Build
npm run build

# Production
npm run start
```

L'application est accessible sur `http://localhost:3000`.

---

## 📁 Structure

```
app/            # Pages (App Router)
components/     # Composants UI
lib/            # API client + hooks
messages/       # i18n (fr/en)
public/         # Assets statiques
types/          # Types partagés
```

---

## 🌍 Internationalisation

Les traductions sont gérées via `next-intl` :

- `messages/fr.json`
- `messages/en.json`

---

<p align="center">
  <strong>QuadriFleet</strong> - IMT Atlantique - FIL A2 2025/2026
</p>
