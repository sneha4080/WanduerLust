pipeline {
    agent any

    stages {
        stage('Git Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sneha4080/WanduerLust.git'
            }
        }

        stage('Docker Check') {
            steps {
                sh 'docker --version'
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t airbnb .'
            }
        }
    }
}
