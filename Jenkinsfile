// pipeline {
//     agent any
//     stages {
//         stage('Checkout') {
//             steps {
//                 git branch: 'main',
//                 credentialsId: 'GitHub_access_token',
//                 url: 'https://github.com/Dr-Pong/dr_pong_api_gateway'
//             }
//         }
//     }
// }
pipeline {
    agent any
    tools {
        nodejs "jenkins-nodejs"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm  // 프로젝트 루트 디렉토리에서 checkout 실행
            }
        }
        stage('install env file') {
            steps {
                sh 'cp /var/jenkins_home/workspace/.env /var/jenkins_home/workspace/drpong_apigateway'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                // 여기에 루트 디렉토리에서 실행할 작업을 정의합니다.
                sh 'npm run build'
            }
        }
        // stage('Docker in Docker Build') {
        //     steps {
        //         sh 'docker-compose up -d --build'
        //     }
        // }
       
        // stage('Docker in Docker test') {
        //     steps {
        //         sh 'docker-compose exec drpong_apigateway npm run test'
        //     }
        // }
        // 얘는 지금 안에 안에 가아니라 안에 서 빌드한얘를 가져다가 하는거임 
        stage('Deploy to AWS') {
            steps {
                sh 'chmod +x deploy/deploy.sh'
                sh 'cp -r /var/jenkins_home/workspace/drpong_apigateway/dist package.json package-lock.json tsconfig.build.json docker-compose.yml .env deploy'
                sh 'scp -i /var/local/deploy-api-key.pem -r /var/jenkins_home/workspace/drpong_apigateway/deploy ec2-user@43.200.254.59:/home/ec2-user/drpong_apigateway'

            }
        }
        stage('Deploy start') {
            steps {
                sh 'ssh -i /var/local/deploy-api-key.pem ec2-user@43.200.254.59 "cd /home/ec2-user/drpong_apigateway/deploy && ./deploy.sh"'
            }
        }
        // 다른 스테이지들...
    }
}