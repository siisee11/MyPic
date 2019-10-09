FROM tensorflow/tensorflow:1.14.0-py3
MAINTAINER siisee111@gmail.com
WORKDIR /usr/src/app
COPY . /usr/src/app
EXPOSE 4567
