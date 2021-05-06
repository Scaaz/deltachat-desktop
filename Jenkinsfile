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
						
				git 'https://github.com/Scaaz/deltachat-desktop.git'
                sh 'npm run build'
				  script { 
                currentBuild.result='UNSTABLE'
            }
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
					echo "Build status: ${currentBuild.currentResult}"
					echo 'Build failed - testing was cancelled'}  
					
				}
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
		echo 'success'		
    	}
    	
    	failure {
		emailext attachLog: true,
			body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} Check attached log for more details...", 
			subject: 'Jenkins has failed', 
			to: 'szymon.czekaj0@gmail.com'
    	}
    }
}
