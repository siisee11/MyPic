<div align="center">
  
  [![Current Version](https://img.shields.io/badge/version-0.1.0-green.svg)](https://github.com/BlindedShooter/SKKU-2019-Fall-Capstone-Design)
  ![Python](https://img.shields.io/badge/python-v3.6+-blue.svg)
  ![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
  ![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
  [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/BlindedShooter/SKKU-2019-Fall-Capstone-Design/graphs/commit-activity)
  
  <img alt="MyPic logo" src="Mypic-logo.png" width="200px" />

  <h1> MYPIC </h1>

  <p>
    <b>Get my photos from anyone. What you need to do is just a click.</b>
  </p>

  <a href="https://itunes.apple.com/us/app/">
    <img alt="Download on the App Store" title="App Store" src="http://i.imgur.com/0n2zqHD.png" width="140">
  </a>

  <a href="https://play.google.com/store/apps">
    <img alt="Get it on Google Play" title="Google Play" src="http://i.imgur.com/mtGRPuM.png" width="140">
  </a>

</div>

# SKKU-2019-Fall-Capstone-Design (MyPic)
성균관대학교 2019학년도 가을학기 종합설계프로젝트 1조 Github 레포지토리

## Roadmap
  - [x] ~~face recognation and classifying~~
  - [x] ~~Support Docker~~
  - [ ] enhance classfication
  - [ ] GPU enable
  - [ ] web 
  - [ ] hybrid application with React.js

## Getting Started with Mypic

This tutorial walks you through the workflow of setting up environment, running an application with your own pictures.
There are two ways of it.

* Use docker to run.
* Build environment on your own computer.

### Docker

If you have sudo privilege, and docker, you can simply build environment with docker. 
```
docker run --rm -it siisee11/mypic:latest
```

If you have sudo privilege, nvidia-docker, and GPUs, you can simply type this.

```
docker run --gpus all --rm -it siisee11/mypic-gpu:1
```


### Environment setting

You need to download Anaconda3 [here](https://www.anaconda.com/distribution/) to run these application.

``` 
$ cd ~
$ wget https://repo.anaconda.com/archive/Anaconda3-2019.07-Linux-x86_64.sh
$ sh Anaconda3-2019.07-Linux-x86_64.sh
$ source .bashrc
```

After downloading it, you have to change the python version from 3.7 to 3.6. 

```
$ conda install python=3.6
```

Or create secondary python environment.

```
$ conda create --name python36 python=3.6
$ conda activate python36
```

Install all requirements.

```
$ pip install -r requirements.txt			# without GPU
or
$ pip install -r requirements-gpu.txt		# with GPU
```


## Contents

1. `Mypic/` contains our actual project directory.
2. `reference/` contains reference project.
3. `Dockerfile` is used to make docker image for this project.
4. `requirements*.txt` are used by pip install.
5. `mypic-logo.png` is our project logo.
