[![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/siisee11)
[![made-with-python](https://img.shields.io/badge/Made%20with-Python-1f425f.svg)](https://www.python.org/)
[![Python 3.6](https://img.shields.io/badge/python-3.6-blue.svg)](https://www.python.org/downloads/release/python-360/)


# Face-classification :family_woman_woman_girl_boy:

Test it with your travel photo with your friends.

## Requirement

### Fill friend-dataset directory

Fill the friend-dataset directory with your photo.

If there is no data then you can download celebrities picture from [here](https://drive.google.com/drive/folders/1exa2lr6yWRS2RW1NGCYKqUjfsv32dL5Z?usp=sharing)

This below is directory hierarchy of this project. 

```
project
│   README.md
│   friend_detect.py
│   friend_embedding.py
│   friend_classify.py
│   face_who_detect.py
│   show_npz.py
│   facenet_keras.h5
│
└───friend-dataset
│   │
│   └───train
│   │   └───person1 
│   │   │   │   p1.jpg
│   │   │   │   ...
│   │   │
│   │   └───person2 
│   │       │   p1.jpg
│   │       │   ...
│   │
│   └───test
│       └───person1 
│       │   │   p1.jpg
│       │   │   ...
│       │
│       └───person2 
│           │   p2.jpg
│           │   ...
│   
```

### Pretrained model
You can download pretrained Keras facenet model (trained by MS-Celeb-1M dataset).
- Download model from [here](https://drive.google.com/open?id=1pwQ3H4aJ8a6yyJHZkTwtjcL4wYWQb7bn) and save it in topmost directory.

## How to run

There are three steps to get results.

1. detect and extract faces from your dataset folder.
1. do embedding to it (preprocessing).
1. run SVM to classify face in your test dataset.

Total workload is below.

```
python friend_detect.py
python friend_embedding.py
python friend_classify <target>.py
```

### Face detection

```python friend_detect.py```

It will generate friend-dataset.npz.

It contains 160X160 pixels of detected faces as zipped numpy.

You can use show_npz python file to visualize the results.

```python show_npz.py -f friend-dataset.npz -t <test|train>``` 



### Face embedding

```python friend_embedding.py```

It will generate friend-embeddings.npz

### Face classifying

```python friend_classify.py -t <target> [--display]```

It trains SVM model from your train inputs and test one of photo from your test inputs.

Target is one of name from your train directory. It will generate result/target directory and extract targes's photos from test directory into it.
