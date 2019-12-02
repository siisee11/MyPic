#!/usr/bin/env python
# coding: utf-8

# In[25]:


import cv2
import sys
import numpy as np
import datetime
import os
import glob
import mxnet as mx
from mxnet import gluon
from skimage import transform as trans

from retinaface import RetinaFace

import numpy as np
from matplotlib import pyplot as plt
import warnings


# In[47]:


thresh = 0.8
scales = [1024, 1980]
detector_gpuid = 0
embedder_gpuid = 0


file_name = 't8'
file_ext = 'png'


# In[27]:


align_src = np.array([
    [38.2946, 51.6963],
    [73.5318, 51.5014],
    [56.0252, 71.7366],
    [41.5493, 92.3655],
    [70.7299, 92.2041]], dtype=np.float32 )

detector = RetinaFace('./model/R50', 0, detector_gpuid, 'net3')

ctx = mx.gpu(embedder_gpuid)

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    deserialized_net = gluon.nn.SymbolBlock.imports("./model/model-r100-ii/model-symbol.json", ['data'], "./model/model-r100-ii/model-0000.params", ctx=ctx)


# In[48]:


img = cv2.imread(f"{file_name}.{file_ext}")

print(f"Image Shape: {img.shape}")

im_shape = img.shape
target_size = scales[0]
max_size = scales[1]
im_size_min = np.min(im_shape[0:2])
im_size_max = np.max(im_shape[0:2])
#im_scale = 1.0   # Use This if you don't want to scale the original image

# if im_size_min>target_size or im_size_max>max_size:
im_scale = float(target_size) / float(im_size_min)
# prevent bigger axis from being more than max_size:
if np.round(im_scale * im_size_max) > max_size:
    im_scale = float(max_size) / float(im_size_max)

print(f"Image Scale: {im_scale}")

im_scales = [im_scale]
flip = False

faces, landmarks = detector.detect(img, thresh, scales=im_scales, do_flip=flip)

print(faces.shape, landmarks.shape)
print(faces.astype(np.int))

if faces is not None:
    print(f"Found {faces.shape[0]} faces")
    for i in range(faces.shape[0]):
        print('score', faces[i][4])
        box = faces[i].astype(np.int)
        
        plt.imshow(img[box[1]:box[3], box[0]:box[2]])
        plt.show()
        
        resized_face = cv2.resize(img[box[1]:box[3], box[0]:box[2]], (112, 112))
        plt.imshow(resized_face)
        plt.show()
        
        box_width = box[2] - box[0]
        box_height = box[3] - box[1]
        
        align_dst = landmarks[i]
        align_dst[:, 0] -= faces[i][0]
        align_dst[:, 1] -= faces[i][1]
        
        align_dst[:, 0] = align_dst[:, 0] / (box_width / 112.0)
        align_dst[:, 1] = align_dst[:, 1] / (box_height / 112.0)
        
        tform = trans.SimilarityTransform()
        tform.estimate(align_dst, align_src)
        M = tform.params[0:2,:]
        aligned_face = cv2.warpAffine(resized_face, M, (112, 112), borderValue = 0.0)
        
        plt.imshow(aligned_face)
        plt.show()
        
        cv2.imwrite(f'./{file_name}_{i}.jpg', aligned_face)
        
        if False and landmarks is not None:
            landmark5 = landmarks[i].astype(np.int)
            #print(landmark.shape)
            for l in range(landmark5.shape[0]):
                color = (0,0,255)
                if l==0 or l==3:
                    color = (0,255,0)
                cv2.circle(img, (landmark5[l][0], landmark5[l][1]), 1, color, 2)

    #filename = './detector_test.jpg'
    #print('writing', filename)
    #cv2.imwrite(filename, img)


# In[18]:





