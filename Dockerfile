FROM tensorflow/tensorflow:1.14.0-py3
MAINTAINER jaeyoun "siisee111@gmail.com"

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN apt update
RUN apt install -y libsm6 libxext6 libxrender-dev
RUN pip install -r requirements.txt
RUN apt install -y wget

CMD /bin/bash
