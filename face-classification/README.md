# Face-classification

Test it with your travel photoes with your friends.

# Requirement

Fill friend-dataset directory first.

This below is directory hierarchy of dataset. 

```
project
│   README.md
│   friend_detect.py
│   friend_embedding.py
│   friend_classify.py
│
└───friend-dataset
│   │
│   └───train
│   │   └───person1 
│	│   │   │   p1.jpg
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


# How to run

There are three steps to get results.

First, detect and extract faces from your dataset folder.
Second, do embedding to it (preprocessing).
Finally, run SVM to classify face in your test dataset.

## Face detection

```python friend_detect.py```

It generate friend-dataset.npz
