pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'apt install npm -y'
                sh 'npm i npm@latest -g'
                sh 'npm fund'
                sh 'npm install'
				
				sh 'apt install git -y'				
				sh 'git clone https://github.com/deltachat/deltachat-desktop.git'
                sh 'npm run build'
            }
        }		
		 post {
    	
    	success {
	 echo 'Building success!'		
    	}    	
    	failure {
		emailext attachLog: true,
			body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} Check attached log for more details...", 
			subject: 'Jenkins building has failed', 
			to: 'szymon.czekaj0@gmail.com'
    	}
    }
		
		
        stage('Test') {
							
            steps {
			script{
					if(currentBuild.result=='SUCCESS'){
			
						echo 'Testing..'				 
						sh 'npm run test' 
						}	
					else{
					echo 'Build failed - testing was cancelled'}
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
			subject: 'Jenkins testing has failed', 
			to: 'szymon.czekaj0@gmail.com'
    	}
    }
		 
	
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
		
    }
	
}