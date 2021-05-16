pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
			script 	{
                    last_started = env.STAGE_NAME
					
					}
                echo 'Building..'
                sh 'apt install npm -y'
                sh 'npm i npm@latest -g'
                sh 'npm fund'
                sh 'npm install'
						
				git 'https://github.com/Scaaz/deltachat-desktop.git'
                sh 'npm run build'
				
				echo 'Building finished successfully!'
            }
        }		
		 		 
        stage('Test') {
							
            steps{
			
				script{
			
                    last_started = env.STAGE_NAME		
									
					if("${currentBuild.currentResult}"=='SUCCESS'){			
					echo 'Testing..'				 
					sh 'npm run test' 
						}	
					else{
					echo "Build status: ${currentBuild.currentResult}"
					echo 'Build failed - testing was cancelled'}  
					
				}
				echo 'Testing finished successfully!'
			}						
        }
		 
		 
	
        stage('Deploy') {
            steps {
			
			script{			
                    last_started = env.STAGE_NAME
				  }
					
                echo 'Deploying....'
				sh 'docker build -t deploy -f dockerfileDeploy .'				
				
				echo 'Deploying finished successfully!'
            }
        }
		
    }
	
	post {
    	
    	success {
		echo 'Pipeline finished successfully'		
    	}
    	
    	unsuccessful {
		emailext attachLog: true,
			body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} Check attached log for more details...", 
			subject: "${last_started} has failed", 
			to: 'szymon.czekaj0@gmail.com'
    	}
    }
}
