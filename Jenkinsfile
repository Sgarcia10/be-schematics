@Library('devops-pipelines-libraries') _

def flow = new com.rappipay.util();
 
pipeline {
  agent { node { label '!master' } }

  options {
    timeout(time: 15, unit: 'MINUTES')
  }

  stages {
    stage('CI_SONAR') {
        steps {
            script {
                flow.init()

                flow.wstage("Test", {
                  sh 'docker-compose run --rm test'
                })

                flow.wstage("Teardown", {
                  sh 'docker-compose down -v'
                })

                flow.wstage("Sonar", {
                  flow.sonarAnalysis();
                })

                flow.wstage("Quality Gate", {
                    timeout(time: 1, unit: 'HOURS') {
                        def qg = waitForQualityGate()
                        if (qg.status != 'OK') {
                        error "Pipeline aborted due to quality gate failure: ${qg.status}"
                        }
                    }
                })

                flow.end();
            }
        }
    }
  }
}