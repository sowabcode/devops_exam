pipeline {
    agent any

    environment {
        COMPOSE_FILE = "docker-compose.yml"
        // agent = "sowab"
    }

    stages {
        stage('Checkout') {
            steps {
                // sshagent(credentials: [$agent])
                git branch: 'main', url: 'https://github.com/sowabcode/devops_exam.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Stop Old Containers') {
            steps {
                sh 'docker compose down'
            }
        }

        stage('Run Containers') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Verify Containers') {
            steps {
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Déploiement réussi !'
        }
        failure {
            echo 'Échec du pipeline'
        }
    }
}