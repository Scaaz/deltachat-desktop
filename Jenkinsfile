pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }		
		
		
        stage('Test') {
            steps {
                echo 'Testing..'
				  sh 'apt install npm -y'
				  sh 'npm test' 
				  
            }
        }
		 
	
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
		
    }
	 post {
    	
    	success {
	 echo 'Testing success!'		
    	}
    	
    	failure {
		emailext attachLog: true,
			body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} Check attached log for more details...", 
			subject: 'Jenkins testing failed', 
			to: 'szymon.czekaj0@gmail.com'
    	}
    }
}