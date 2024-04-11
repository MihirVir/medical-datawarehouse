PLEASE NOTE: 
I have updated the files so you don't have to follow step 3 just spin 
skaffold dev until you see desired results in the terminal because
skaffold acts buggy sometimes



The youtube link is of me going through installation process if you hate reading text
use that link explained the installation by going through each step.



Installation Guide:

Overview I will be going through how to setup the project by downloading necessary dependencies

Video to setup the Project: https://www.youtube.com/watch?v=xyMGFLP5wk8 (by me only) 

1)  Step 1: It's presummed that you already have Docker and Kubernetes in your machine 
    I am using Docker Desktop Kubernetes Environment so I will be showing you steps to enable It

    STEPS to Enable Docker Desktop Kubernetes (Make sure minikube is turned off
    because sometimes it clashes with docker desktop kubernetes):
        1) Step 1: Open Docker Desktop 
        2) Step 2: Click on Settings
        3) Step 3: Go to Kubernetes tab
        4) Step 4: Click on Enable Kubernetes
        5) Step 5: Click on Apply and Restart

2)  Step 2: After Installing Docker Desktop Kubernetes. You would need to write 
    the following Command in your terminal This command will setup ingress-nginx
    service in your kubernetes cluster

    kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

    Please make sure you enter this entire command and see 
    the list of kubernetes Objects being configured

3)  (Already done for you but mentioning it because it's cool to know) Step 3: Now, we have kubernetes and inrgess-nginx setted up. Unfortunately as 
    you don't have my Login Credentials to Google Cloud we won't be able to deploy 
    the current src file to the Google Cloud. 
    
    So we will need to make changes to following files: 
    
    skaffold.yaml, backend-depl.yaml, and frontend-depl.yaml

    The changes are already made available to you for your own convenience make sure to change the name of these files to above files 
    
    Already changes made in the files name:
        1) skaffold.old.yaml [change name to -> skaffold.yaml]
        2) backend-depl.old.yaml [change name to -> backend-depl.yaml]
        3) front-end-depl.old.yaml [change name to -> frontend-depl.yaml]

4)  Step 4: After making these changes I would like to put my emphasis on 
    Downloading Skaffold. For your own convenience on 
    building the docker image and then pushing it to docker hub
    and then restarting the deployment is always a tideous process.
    To make this process easier I will be using skaffold.


    To Download Skaffold I will be providing you a link of skaffold website
    and even try to provide a video of mine downloading it.

    Documentation on how to download Skaffold: https://skaffold.dev/docs/install/

    command to download skaffold: 
        brew install skaffold [using homebrew]

    Remember when you spin up your skaffold file by running the command 
    
        skaffold dev 
    
    Don't panic when you see an error when you build the images and kubernetes objects
    for the first time to fix this issue read the below step

    All you need to do to fix this issue is simply re run the command

        skaffold dev [run this again if you see any errors]

    Running up this command will fix all the errors that skaffold displayed 
    earlier as it might be a bug on skaffold's part.

5)  Step 5: After successfully running the command skaffold dev and 
    hopefully not seeing any errors. Now to access the running code you just need to go 
    to the following link:

        localhost: 127.0.0.1/

        hosted: http://34.78.17.49/

    Sorry, but the design of the website is not mobile responsive please try to view it 
    on a laptop of resolution of 1920 x 1080.


If you made this far I would like to Thank you for reading this detailed documentation
