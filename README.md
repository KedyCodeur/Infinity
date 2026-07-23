# Infinity

Application mobile full-stack d'automatisation commerciale pour terminaux **Sunmi**, développée pendant mon stage chez InfoConcept. Elle permet aux équipes en magasin de gérer produits, prix et étiquetage directement depuis le terminal, avec impression thermique embarquée pilotée nativement.

## Aperçu

Infinity connecte un client mobile React Native/Expo à une API sécurisée, avec un pont natif Java permettant de piloter directement le système d'impression thermique intégré des terminaux Sunmi — un besoin que les librairies React Native classiques ne couvrent pas nativement.

## Architecture

Le dépôt est organisé en deux parties :

```
Infinity/
├── Infinity/          # Client mobile (React Native / Expo)
└── InfinityBackend/    # API backend (Node.js / Express)
```

### `Infinity` — Client mobile
- **React Native / Expo**
- Scan de références produits et affichage dynamique des données
- Requêtes asynchrones via **Axios** pour la synchronisation en temps réel
- Interface disponible en **6 langues** (i18n)
- **Module natif Java (Bridge)** pour piloter l'impression thermique embarquée sur les terminaux Sunmi

### `InfinityBackend` — API
- **Node.js / Express**
- Authentification et sécurisation des échanges via **JWT**
- Gestion et interrogation en temps réel de la base de données produits/prix

## Fonctionnalités clés

- 📦 Gestion des produits, prix et étiquetage en magasin
- 🖨️ Génération et impression d'étiquettes directement depuis le terminal (bridge natif Java)
- 🔄 Synchronisation des données en temps réel (scan → requête → affichage)
- 🔐 API sécurisée par authentification JWT
- 🌍 Interface localisée en 6 langues

## Stack technique

| Côté | Technologies |
|---|---|
| Mobile | React Native, Expo, Java (module natif) |
| Backend | Node.js, Express, JWT |
| Communication | Axios, API REST |
| Matériel | Terminaux Sunmi (impression thermique embarquée) |

## Installation

### Backend
```bash
cd InfinityBackend
npm install
npm start
```

### Application mobile
```bash
cd Infinity
npm install
npx expo start
```

> ⚠️ Le module natif Java (impression thermique) nécessite un build sur un terminal Sunmi réel ou un émulateur compatible ; il n'est pas fonctionnel sur Expo Go.

## Contexte

Projet développé dans le cadre d'un stage de développeur full-stack chez **InfoConcept** (mai–juillet 2026), en intégration avec les bases de données produits existantes de l'entreprise.

## Auteur

**Cem Sah Ozdemirel**
[GitHub](https://github.com/KedyCodeur) · [Portfolio](https://kedycodeur.vercel.app) · [LinkedIn](https://linkedin.com/in/cemsahozdemirel)
