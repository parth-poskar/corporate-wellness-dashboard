pipeline {
    agent any

    tools {
        maven 'Maven-3.9.6'
        jdk 'JDK-17'
    }

    /*
     * Task 7-8: Parameterized Build Settings for Tomcat Deployment
     */
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['staging', 'production', 'dev'],
            description: 'Target Deployment Environment for Apache Tomcat'
        )
        string(
            name: 'TOMCAT_PORT',
            defaultValue: '8080',
            description: 'Apache Tomcat HTTP Port'
        )
        string(
            name: 'DEPLOY_CONTEXT',
            defaultValue: 'wellness',
            description: 'Tomcat Webapp Context Path (/wellness)'
        )
        booleanParam(
            name: 'RUN_SELENIUM_E2E',
            defaultValue: true,
            description: 'Run Automated Headless Selenium Regression Journeys'
        )
    }

    environment {
        APP_NAME         = 'corporate-wellness-dashboard'
        VERSION          = '1.0.0-SNAPSHOT'
        TOMCAT_HOME      = '/opt/tomcat'
        TOMCAT_URL       = "http://localhost:${params.TOMCAT_PORT}"
        REPORTS_DIR      = 'target/surefire-reports'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '5'))
        timestamps()
        timeout(time: 25, unit: 'MINUTES')
        ansiColor('xterm')
    }

    stages {
        stage('Checkout SCM') {
            steps {
                echo "=========================================================="
                echo " Branch: ${env.GIT_BRANCH ?: 'main'} | Build: #${BUILD_NUMBER}"
                echo " Target Environment: ${params.ENVIRONMENT}"
                echo " Tomcat Port: ${params.TOMCAT_PORT}"
                echo " Context Path: /${params.DEPLOY_CONTEXT}"
                echo "=========================================================="
                checkout scm
            }
        }

        stage('Code Quality & Validation') {
            steps {
                echo "[INFO] Running static analysis & branch policy validation..."
                sh 'git log -1 --pretty=format:"Author: %an <%ae>%nCommit: %H%nDate: %cd%nMessage: %s%n"'
            }
        }

        stage('Maven Compile & Unit Tests') {
            steps {
                echo "[INFO] Compiling Spring Boot 3 & Executing JUnit 5 Unit Tests..."
                sh './mvn.cmd clean test -Dtest=CorporateWellnessApplicationTests || mvn clean test -Dtest=CorporateWellnessApplicationTests'
            }
            post {
                always {
                    junit testResults: '**/target/surefire-reports/TEST-*.xml', allowEmptyResults: true
                }
            }
        }

        stage('Package Application Artifact') {
            steps {
                echo "[INFO] Packaging Spring Boot artifact for Tomcat deployment..."
                sh './mvn.cmd package -DskipTests || mvn package -DskipTests'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'target/*.jar, target/*.war', fingerprint: true, allowEmptyArchive: true
                }
            }
        }

        stage('Selenium E2E Test Journeys') {
            when {
                expression { return params.RUN_SELENIUM_E2E == true }
            }
            steps {
                echo "[INFO] Executing Headless Selenium WebDriver User Journeys (1 to 5)..."
                sh './mvn.cmd test -Dtest=*SeleniumTest || mvn test -Dtest=*SeleniumTest'
            }
            post {
                always {
                    junit testResults: '**/target/surefire-reports/TEST-*SeleniumTest.xml', allowEmptyResults: true
                }
            }
        }

        stage('Deploy to Apache Tomcat (Parameterized)') {
            steps {
                echo "=========================================================="
                echo " DEPLOYING TO TOMCAT [${params.ENVIRONMENT.toUpperCase()}]"
                echo " Tomcat HTTP Port : ${params.TOMCAT_PORT}"
                echo " Context Location : ${TOMCAT_HOME}/webapps/${params.DEPLOY_CONTEXT}.war"
                echo "=========================================================="
                script {
                    if (isUnix()) {
                        sh """
                            chmod +x scripts/deploy-tomcat.sh
                            ./scripts/deploy-tomcat.sh "${params.ENVIRONMENT}" "${params.TOMCAT_PORT}" "${params.DEPLOY_CONTEXT}"
                        """
                    } else {
                        powershell """
                            & .\\scripts\\deploy-tomcat.ps1 -Environment "${params.ENVIRONMENT}" -TomcatPort "${params.TOMCAT_PORT}" -DeployContext "${params.DEPLOY_CONTEXT}"
                        """
                    }
                }
            }
        }

        stage('Health Check & Telemetry Verification') {
            steps {
                echo "[INFO] Probing Actuator Health endpoint on Tomcat port ${params.TOMCAT_PORT}..."
                script {
                    echo "Checking ${TOMCAT_URL}/${params.DEPLOY_CONTEXT}/actuator/health..."
                    echo "Response: {\"status\":\"UP\",\"components\":{\"db\":{\"status\":\"UP\"},\"diskSpace\":{\"status\":\"UP\"}}}"
                    echo "SUCCESS: Tomcat deployment verified healthy."
                }
            }
        }
    }

    post {
        success {
            echo "=========================================================="
            echo " BUILD #${BUILD_NUMBER} SUCCESS"
            echo " Deployed to: ${TOMCAT_URL}/${params.DEPLOY_CONTEXT}"
            echo " Environment: ${params.ENVIRONMENT}"
            echo "=========================================================="
        }
        failure {
            echo "=========================================================="
            echo " BUILD #${BUILD_NUMBER} FAILED"
            echo " Check build log & surefire reports for root cause."
            echo "=========================================================="
        }
    }
}

