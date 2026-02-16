# 📅 Système de Gestion des Rendez-vous

Un système complet et moderne de gestion des rendez-vous avec une architecture microservices, développé avec une pile technologique robuste.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture](#architecture)
- [Structure du projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation et Configuration](#installation-et-configuration)
- [Services](#services)
- [Utilisation](#utilisation)
- [Développement](#développement)
- [Technologies](#technologies)
- [Fonctionnalités](#fonctionnalités)
- [Contribution](#contribution)

## 🎯 Vue d'ensemble

Ce projet est une application de gestion des rendez-vous fonctionnant avec une architecture microservices. Elle permet aux utilisateurs de :

- S'authentifier et gérer leurs comptes
- Créer et gérer des rendez-vous
- Consulter la disponibilité
- Gérer les profils utilisateurs
- Gérer les administrateurs et les utilisateurs

## 🏗️ Architecture

Le projet utilise une architecture **microservices** avec une communication asynchrone via **Apache Kafka** :

```
┌─────────────────────────────────────────┐
│           Frontend (React)               │
│          (Port 5173 - Vite)             │
└────────────────┬────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼────┐      ┌───▼────┐
    │ Service │      │ Service │
    │ User    │◄────►│  Appt   │
    │(Node.js)│      │(Spring) │
    │ Port 3000        Port 8080
    └────┬────┘      └───┬────┘
         │                │
         │     Kafka      │
         │   (Message)    │
         └────────────────┘
            Bus Événements
```

## 📁 Structure du projet

```
all-in/
├── appointement/              # Service de gestion des rendez-vous (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/appointement/
│   │   │   │       ├── AppointementApplication.java
│   │   │   │       ├── Config/                 # Configuration
│   │   │   │       ├── Controllers/            # Endpoints REST
│   │   │   │       ├── DTO/                    # Data Transfer Objects
│   │   │   │       ├── Entities/               # Modèles JPA
│   │   │   │       ├── kafka/                  # Consumer/Producer Kafka
│   │   │   │       ├── Repositories/           # Data Access
│   │   │   │       └── Services/               # Logique métier
│   │   │   └── resources/
│   │   │       ├── application.properties      # Configuration
│   │   │       ├── static/
│   │   │       └── templates/
│   │   └── test/
│   ├── pom.xml                # Dépendances Maven
│   ├── mvnw & mvnw.cmd        # Maven Wrapper
│   └── target/                # Artefacts compilés
│
├── User/                      # Service de gestion des utilisateurs (Node.js)
│   ├── src/
│   │   ├── app.js             # Application principale
│   │   ├── config/
│   │   │   ├── dbConfig.js    # Configuration base de données
│   │   │   └── initialConfig.js # Configuration initiale
│   │   ├── controllers/        # Logique métier
│   │   │   └── authController.js
│   │   ├── kafka/             # Intégration Kafka
│   │   │   └── userValidation.js
│   │   ├── middlewares/       # Middlewares Express
│   │   │   ├── authMiddleware.js
│   │   │   └── validators/
│   │   │       └── authValidator.js
│   │   ├── models/            # Schémas Mongoose/Sequelize
│   │   │   ├── User.js
│   │   │   └── Resume.js
│   │   ├── routes/            # Définition des routes
│   │   │   └── authRoutes.js
│   │   └── utils/             # Utilitaires
│   │       ├── broker.js      # Configuration du broker Kafka
│   │       └── passwordUtils.js # Gestion des mots de passe
│   ├── package.json
│   ├── dockerfile
│   └── README.md
│
├── Frontend/                  # Interface utilisateur (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx            # Composant principal
│   │   ├── main.tsx           # Entrée de l'application
│   │   ├── theme.ts           # Configuration du thème
│   │   ├── assets/            # Images, fichiers statiques
│   │   ├── components/        # Composants React réutilisables
│   │   │   ├── auth/          # Authentification
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── Availability/  # Disponibilité
│   │   │   │   └── Availability.tsx
│   │   │   ├── CreateAppointment/ # Création de rendez-vous
│   │   │   │   └── CreateApointment.tsx
│   │   │   ├── ManageUsers/   # Gestion des utilisateurs
│   │   │   │   └── ManageUsers.tsx
│   │   │   ├── Profile/       # Profil utilisateur
│   │   │   │   └── Profile.tsx
│   │   │   ├── Logo/          # Logo personnalisé
│   │   │   │   └── CustomLogo.tsx
│   │   │   ├── ProtectedRoute/ # Routes protégées
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   └── utils/         # Composants utilitaires
│   │   │       └── TableSort.tsx
│   │   ├── Contexts/          # Contexte React
│   │   │   └── AuthContext.tsx
│   │   └── Layouts/           # Layouts
│   │       ├── AdminLayout.tsx
│   │       └── ClientLayout.tsx
│   ├── public/                # Fichiers publics
│   ├── package.json           # Dépendances npm
│   ├── vite.config.ts         # Configuration Vite
│   ├── tsconfig.json          # Configuration TypeScript
│   ├── eslint.config.js       # Configuration ESLint
│   ├── postcss.config.cjs     # Configuration PostCSS
│   └── index.html             # HTML principal
│
└── README.md                  # Ce fichier
```

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

### Globalement :
- **Git** - Gestion de version
- **Docker** (optionnel) - Containerisation
- **Apache Kafka** ou **RabbitMQ** - Message broker

### Pour le Backend (appointement) :
- **Java 11+** - Langage de programmation
- **Maven 3.6+** - Gestionnaire de dépendances

### Pour le Service Utilisateur :
- **Node.js 16+** - Environnement d'exécution JavaScript
- **npm 7+** ou **yarn** - Gestionnaire de paquets

### Pour la Base de Données :
- **MySQL 8+** ou **MongoDB** - Base de données
- Voir `User/src/config/dbConfig.js` pour les configurations

## 📦 Installation et Configuration

### 1. Cloner le repository

```bash
git clone <repository-url>
cd all-in
```

### 2. Service Appointement (Spring Boot)

```bash
cd appointement/appointement

# Compiler le projet
./mvnw clean compile

# Lancer les tests
./mvnw test

# Démarrer l'application
./mvnw spring-boot:run
```

L'application sera disponible sur `http://localhost:8080`

**Configuration (application.properties)** :
```properties
server.port=8080
spring.kafka.bootstrap-servers=localhost:9092
spring.datasource.url=jdbc:mysql://localhost:3306/appointement
spring.datasource.username=root
spring.datasource.password=password
```

### 3. Service Utilisateur (Node.js)

```bash
cd User

# Installer les dépendances
npm install

# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

L'application sera disponible sur `http://localhost:3000`

**Configuration (User/src/config/dbConfig.js)** :
```javascript
// Configurer les paramètres de connexion à la base de données
// Ajuster selon votre environnement (MongoDB ou MySQL)
```

### 4. Frontend (React)

```bash
cd Frontend

# Installer les dépendances
npm install

# Développement avec Vite
npm run dev

# Construire pour la production
npm run build

# Vérifier avec ESLint
npm run lint

# Prévisualiser la build
npm run preview
```

Le frontend sera disponible sur `http://localhost:5173`

## 🔌 Services

### Service Appointement (Spring Boot - Port 8080)

Service responsable de la gestion des rendez-vous.

**Endpoints principaux** :
- `GET /api/appointments` - Lister les rendez-vous
- `POST /api/appointments` - Créer un rendez-vous
- `GET /api/appointments/{id}` - Obtenir un rendez-vous
- `PUT /api/appointments/{id}` - Modifier un rendez-vous
- `DELETE /api/appointments/{id}` - Supprimer un rendez-vous
- `GET /api/availability` - Consulter les créneaux disponibles

**Fonctionnalités Kafka** :
- Consomme les événements de validation d'utilisateurs
- Produit les événements de statut de rendez-vous

### Service Utilisateur (Node.js - Port 3000)

Service responsable de la gestion des utilisateurs et de l'authentification.

**Endpoints principaux** :
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/users` - Lister les utilisateurs
- `GET /api/users/{id}` - Obtenir un utilisateur
- `PUT /api/users/{id}` - Modifier un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

**Fonctionnalités** :
- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Validation des données avec express-validator
- Génération de CV avec Puppeteer
- Intégration Kafka pour la validation

### Frontend (React - Port 5173)

Interface utilisateur moderne et réactive.

**Composants principaux** :
- **Authentification** - Login et Enregistrement
- **Gestion des Rendez-vous** - Créer, consulter, modifier
- **Availability** - Consulter les créneaux libres
- **Profil Utilisateur** - Gérer les informations personnelles
- **Gestion des Utilisateurs** - Interface administrateur
- **Navigation** - Layouts Admin et Client

## 💻 Utilisation

### Flux utilisateur standard

1. **Enregistrement**
   - Accédez à `http://localhost:5173/register`
   - Remplissez le formulaire d'enregistrement
   - Validez votre compte

2. **Connexion**
   - Accédez à `http://localhost:5173/login`
   - Entrez vos identifiants
   - Accédez au dashboard

3. **Gestion des rendez-vous**
   - Consultez les créneaux disponibles
   - Créez un nouveau rendez-vous
   - Visualisez vos rendez-vous confirmés

### Communication inter-services

Les services communiquent via **Kafka** :

**Exemple de flux** :
1. Un utilisateur crée un rendez-vous via le frontend
2. Le service Appointement reçoit la requête
3. Un événement est publié sur Kafka
4. Le service User consomme l'événement et valide l'utilisateur
5. Un événement de confirmation est publié
6. Le frontend reçoit la confirmation

## 🛠️ Développement

### Configuration de l'IDE

#### Pour Spring Boot (appointement)
- Utiliser **VS Code** avec l'extension **Extension Pack for Java**
- Ou **IntelliJ IDEA Community Edition**
- Ou **Eclipse**

#### Pour Node.js
- Utiliser **VS Code** avec les extensions :
  - **ESLint**
  - **Prettier**
  - **REST Client**

#### Pour React
- Utiliser **VS Code** avec les extensions :
  - **ES7+ React/Redux/React-Native snippets**
  - **Prettier**
  - **TypeScript Vue Plugin**

### Format de code

```bash
# Frontend
cd Frontend
npm run lint

# Utiliser Prettier pour formater
npx prettier --write src/
```

### Linting

- **Frontend** : ESLint (voir `eslint.config.js`)
- **Backend Appointement** : Intégré dans Maven
- **Service Utilisateur** : À configurer selon les besoins

## 🚀 Technologies

### Backend

#### Service Appointement (Spring Boot)
- **Java 11+**
- **Spring Boot** - Framework web
- **Spring Data JPA** - ORM
- **MySQL** - Base de données relationnelle
- **Kafka** - Message broker asynchrone
- **Maven** - Gestionnaire de dépendances

#### Service Utilisateur (Node.js)
- **Node.js** - Environnement d'exécution
- **Express** - Framework web
- **Mongoose/Sequelize** - ODM/ORM
- **JWT** - Authentification
- **bcrypt** - Hachage des mots de passe
- **Kafka.js** - Client Kafka
- **Puppeteer** - Génération de PDF/CV
- **Morgan** - Logging HTTP
- **Helmet** - Sécurité des headers
- **CORS** - Gestion des requêtes cross-origin

### Frontend

- **React 19** - Bibliothèque UI
- **TypeScript** - Langage typé
- **Vite** - Bundler
- **Mantine** - Composants UI modernes
  - @mantine/core
  - @mantine/form
  - @mantine/dates
  - @mantine/notifications
  - @mantine/hooks
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Day.js** - Manipulation des dates
- **Tabler Icons** - Icônes
- **ESLint** - Lintage du code
- **PostCSS** - Post-processeur CSS

### Infrastructure

- **Apache Kafka** - Message broker
- **MySQL / MongoDB** - Bases de données
- **Docker** (optionnel) - Containerisation
- **Git** - Contrôle de version

## ✨ Fonctionnalités

### Authentification
- ✅ Enregistrement d'utilisateurs
- ✅ Connexion sécurisée avec JWT
- ✅ Gestion des sessions
- ✅ Hachage des mots de passe (bcrypt)

### Gestion des Rendez-vous
- ✅ Créer un rendez-vous
- ✅ Consulter les rendez-vous
- ✅ Modifier un rendez-vous
- ✅ Supprimer un rendez-vous
- ✅ Consulter la disponibilité

### Gestion des Utilisateurs
- ✅ Créer un utilisateur
- ✅ Consulter les utilisateurs
- ✅ Modifier les profils
- ✅ Supprimer des utilisateurs
- ✅ Gérer les rôles (Admin, Client)

### Interface Utilisateur
- ✅ Design moderne avec Mantine
- ✅ Responsive et mobile-friendly
- ✅ Thème personnalisable
- ✅ Navigation intuitive
- ✅ Layouts séparés (Admin/Client)
- ✅ Flux d'authentification sécurisé

### Communication
- ✅ API REST
- ✅ Événements asynchrones via Kafka
- ✅ Validation des données
- ✅ Gestion d'erreurs robuste

## 📝 Variables d'environnement

### User Service
```
NODE_ENV=development
PORT=3000
KAFKA_BROKERS=localhost:9092
DB_HOST=localhost
DB_PORT=3306
DB_NAME=users
DB_USER=root
DB_PASSWORD=password
JWT_SECRET=your-secret-key
```

### Appointement Service
Configuration dans `src/main/resources/application.properties`

## 🐛 Troubleshooting

### Les services ne communiquent pas
- ✅ Vérifier que Kafka est en cours d'exécution
- ✅ Vérifier les topics Kafka sont créés
- ✅ Vérifier les logs des services

### Erreurs de base de données
- ✅ Vérifier que MySQL/MongoDB est en cours d'exécution
- ✅ Vérifier les identifiants de connexion
- ✅ Vérifier que la base de données existe

### Frontend ne se connecte pas au backend
- ✅ Vérifier que les services backend sont démarrés
- ✅ Vérifier la configuration CORS
- ✅ Vérifier les ports utilisés

## 📚 Documentation supplémentaire

- [Help Backend](appointement/appointement/HELP.md)
- [Help User Service](User/README.md)
- [Frontend README](Frontend/README.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche de feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request



