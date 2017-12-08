def projectName = "ava-api"
def s3BucketURL = "ava-contentment.s3.amazonaws.com"
def jenkinsURL = "http://ec2-34-228-73-99.compute-1.amazonaws.com"
def prNumber = env.BRANCH_NAME
def githubURL = "https://github.com/zfranklyn/$projectName/pulls/$prNumber"
def slackChannel = "contentmentfoundation"

def sendMessageToSlack(String color, String message) {
    def notifyChannel = 'ava'
    slackSend(color: color, message: message, channel: notifyChannel)
}

pipeline {
  agent any
  stages {
    stage('Initial Stage'){
      steps {
        sh "echo \"PR Number: ${prNumber}\""
        sh "echo \"github URL: ${githubURL}\""
        sendMessageToSlack('good', "AVA-API: Build for Branch #${prNumber} successful");
      }
    }
    stage('Build') {
      steps { 
        sh 'ls' 
      }
    }
  }
}

