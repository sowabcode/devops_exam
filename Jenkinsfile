pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        APP_NAME     = 'bibliotheque-dit'
    }

    stages {

        stage('Récupération du code') {
            steps {
                echo ' Clonage du dépôt GitHub...'
                checkout scm
            }
        }

        stage('Vérification de l\'environnement') {
            steps {
                echo '🔍 Vérification des outils disponibles...'
                sh 'docker --version'
                sh 'docker compose version'
            }
        }

        stage('Build des images Docker') {
            steps {
                echo ' Construction des images Docker...'
                sh 'docker compose -f ${COMPOSE_FILE} build --no-cache'
            }
        }

        stage('Arrêt des conteneurs existants') {
            steps {
                echo ' Arrêt des anciens conteneurs...'
                sh 'docker compose -f ${COMPOSE_FILE} down --remove-orphans || true'
            }
        }

        stage('Déploiement') {
            steps {
                echo ' Démarrage des services...'
                sh 'docker compose -f ${COMPOSE_FILE} up -d'
            }
        }

        stage('Vérification du déploiement') {
            steps {
                echo ' Vérification que les services sont actifs...'
                sh 'sleep 15'
                sh 'docker compose -f ${COMPOSE_FILE} ps'
                sh '''
                    docker compose -f ${COMPOSE_FILE} ps | grep "backend" | grep "Up" \
                    && echo "Backend opérationnel" \
                    || echo " Backend non démarré"
                '''
                sh '''
                    docker compose -f ${COMPOSE_FILE} ps | grep "frontend" | grep "Up" \
                    && echo " Frontend opérationnel" \
                    || echo "  Frontend non démarré"
                '''
            }
        }
    }

    post {
        success {
            echo '''
             Pipeline exécuté avec succès !
             Frontend  : http://localhost:3000
             Backend   : http://localhost:8000
             API Docs  : http://localhost:8000/docs
            '''
        }
        failure {
            echo ' Pipeline échoué. Consultez les logs ci-dessus.'
            sh 'docker compose -f ${COMPOSE_FILE} logs --tail=50 || true'
        }
        always {
            echo ' Fin du pipeline Jenkins.'
        }
    }
}
