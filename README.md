# TouriWeather Backend

Ce projet est un backend développé en **Node.js** avec **Express** pour l'application **TouriWeather**, une application de météo et de gestion de voyages. Il utilise **MongoDB** comme base de données et **bcrypt** pour le hachage des mots de passe. L'application permet l'inscription, la connexion des utilisateurs, et la gestion des fonctionnalités de réinitialisation de mot de passe.

## Fonctionnalités

- **Inscription des utilisateurs** : Création d'un compte avec hachage sécurisé du mot de passe.
- **Connexion des utilisateurs** : Authentification avec vérification du mot de passe.
- **Réinitialisation de mot de passe** : Envoi d'un email pour permettre la réinitialisation du mot de passe.
- **Stockage sécurisé des informations** : Utilisation de `bcrypt` pour hacher les mots de passe avant de les enregistrer dans la base de données.
- **Gestion des bases de données MongoDB** : Choix entre une base de données locale et MongoDB Atlas.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/) (v12.x ou plus)
- [MongoDB](https://www.mongodb.com/) (localement ou sur MongoDB Atlas)

## Installation

1. Clonez ce dépôt :

```bash
git clone https://github.com/votre-utilisateur/touriweather-backend.git
cd touriweather-backend
2. Installez les dépendances :
npm install

3. Configurez le fichier .env :
MONGODB_URI_LOCAL=mongodb://localhost:27017/mydatabase
MONGODB_URI_ATLAS=mongodb+srv://votre-utilisateur:mot-de-passe@cluster.mongodb.net/nom-de-base-de-donnees?retryWrites=true&w=majority
USE_ATLAS=true
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=mot-de-passe-email
FRONTEND_URL=http://localhost:3000
Lancer l'application
Pour démarrer le serveur en mode développement :
npm run dev
Pour démarrer le serveur en production :
npm start
Tests :
npm test
Structure du Projet :
.
├── models
│   └── User.js          # Schéma utilisateur
├── routes
│   └── userRoutes.js    # Routes pour les utilisateurs
├── .env                 # Fichier de configuration d'environnement
├── server.js            # Point d'entrée du serveur
├── package.json         # Dépendances du projet
└── README.md            # Documentation du projet
Tech :
Technologies utilisées
•	Node.js : Environnement d'exécution pour JavaScript côté serveur.
•	Express : Framework web minimaliste pour Node.js.
•	MongoDB : Base de données NoSQL.
•	Mongoose : ODM pour MongoDB et Node.js.
•	bcrypt : Pour le hachage sécurisé des mots de passe.
•	Nodemailer : Pour l'envoi d'emails de réinitialisation de mot de passe.
Auteurs
•	Eric Noel - Développeur principal.


