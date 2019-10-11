FROM nvidia/cuda:10.0-base-ubuntu18.04
FROM tensorflow/tensorflow:1.14.0-gpu-py3
MAINTAINER jaeyoun "siisee111@gmail.com"

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN apt update
RUN apt install -y libsm6 libxext6 libxrender-dev
RUN pip install -r requirements-gpu.txt

CMD /bin/bash
