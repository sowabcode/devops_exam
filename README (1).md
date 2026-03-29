#  Bibliothèque Numérique DIT — DevOps Microservices

> Projet DevOps — Master 1 Intelligence Artificielle  
> Dakar Institute of Technology (DIT)

---

##  Présentation

Plateforme web de gestion de bibliothèque académique basée sur une architecture microservices.  
Elle permet de gérer les livres, les utilisateurs et les emprunts du DIT.

---

##  Architecture

```
devops_exam/
├── backend/          # API REST — FastAPI + PostgreSQL
│   ├── app/
│   │   ├── main.py       # Points d'entrée API
│   │   ├── models.py     # Modèles SQLAlchemy
│   │   ├── schemas.py    # Schémas Pydantic
│   │   ├── crud.py       # Logique métier
│   │   └── database.py   # Connexion PostgreSQL
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/         # Interface React + Vite + TailwindCSS
│   ├── src/
│   │   ├── pages/        # Livres, Utilisateurs, Emprunts
│   │   ├── components/   # Sidebar, Topbar
│   │   └── routes/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

---

##  Technologies utilisées

| Composant   | Technologie              |
|-------------|--------------------------|
| Backend     | FastAPI (Python 3.11)    |
| Frontend    | React + Vite + TailwindCSS |
| Base de données | PostgreSQL 15        |
| Conteneurs  | Docker + Docker Compose  |
| CI/CD       | Jenkins                  |

---

##  Lancement avec Docker Compose

### Prérequis
- [Docker](https://docs.docker.com/get-docker/) installé
- [Docker Compose](https://docs.docker.com/compose/) installé

### Démarrage

```bash
# 1. Cloner le dépôt
git clone https://github.com/<votre-username>/devops_exam.git
cd devops_exam

# 2. Lancer tous les services
docker compose up --build -d

# 3. Vérifier que tout tourne
docker compose ps
```

### Accès aux services

| Service      | URL                          |
|--------------|------------------------------|
| Frontend     | http://localhost:5173        |
| Backend API  | http://localhost:8000        |
| API Docs     | http://localhost:8000/docs   |

### Arrêt des services

```bash
docker compose down
```

### Arrêt + suppression des données

```bash
docker compose down -v
```

---

##  Lancement en développement (sans Docker)

### Backend

```bash
cd backend

# Créer et activer le venv
python -m venv venv
source venv/bin/activate   # Linux/Mac
# venv\Scripts\activate    # Windows

# Installer les dépendances
pip install -r requirements.txt

# Lancer (PostgreSQL doit être accessible sur localhost:5432)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

##  Pipeline CI/CD Jenkins

### Prérequis Jenkins
- Jenkins installé avec Docker accessible
- Plugin **Git** installé
- Plugin **Pipeline** installé

### Configuration

1. Créer un nouveau **Pipeline** dans Jenkins
2. Dans la section **Pipeline**, choisir `Pipeline script from SCM`
3. Renseigner l'URL du dépôt GitHub
4. Le fichier `Jenkinsfile` est à la racine du projet

### Étapes du pipeline

| Étape | Description |
|-------|-------------|
| Récupération du code | `git checkout` depuis GitHub |
| Vérification de l'environnement | Vérifie Docker et Docker Compose |
| Build des images Docker | `docker compose build --no-cache` |
| Arrêt des anciens conteneurs | `docker compose down` |
| Déploiement | `docker compose up -d` |
| Vérification | Contrôle que les services sont actifs |

---

##  API Endpoints

### Livres
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/livres/` | Lister tous les livres |
| POST | `/api/livres/` | Ajouter un livre |
| GET | `/api/livres/{id}` | Détail d'un livre |
| PUT | `/api/livres/{id}` | Modifier un livre |
| DELETE | `/api/livres/{id}` | Supprimer un livre |
| GET | `/api/livres/search?q=` | Recherche par titre/auteur/ISBN |

### Utilisateurs
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/utilisateurs/` | Lister les utilisateurs |
| POST | `/api/utilisateurs/` | Créer un utilisateur |
| GET | `/api/utilisateurs/{id}` | Profil utilisateur |
| DELETE | `/api/utilisateurs/{id}` | Supprimer un utilisateur |

### Emprunts
| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/emprunts/` | Lister les emprunts |
| POST | `/api/emprunts/` | Emprunter un livre |
| PUT | `/api/emprunts/{id}/retour` | Retourner un livre |
| GET | `/api/utilisateurs/{id}/emprunts` | Historique utilisateur |
| GET | `/api/emprunts/retards/` | Détecter les retards |

---

##  Équipe

Projet réalisé dans le cadre de l'examen pratique DevOps  
Master 1 Intelligence Artificielle — DIT Dakar  
Mars 2026
