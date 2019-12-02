#!/usr/bin/env python
# coding: utf-8

# In[66]:


from __future__ import print_function

import mxnet as mx
import mxnet.ndarray as nd
from mxnet import nd, autograd, gluon
from mxnet.gluon.data.vision import transforms
import cv2
from imutils.face_utils import FaceAligner

import numpy as np
from matplotlib import pyplot as plt
import warnings


# In[2]:


ctx = mx.gpu() if mx.context.num_gpus() else mx.cpu()


# In[3]:


with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    deserialized_net = gluon.nn.SymbolBlock.imports("./model/model-r100-ii/model-symbol.json", ['data'], "./model/model-r100-ii/model-0000.params", ctx=ctx)


# In[37]:


def get_angle_between_embeddings(emb1, emb2):
    return mx.nd.arccos(mx.nd.sum(emb1 * emb2) / emb1.norm() / emb2.norm())


# In[159]:


images1 = []
images2 = []
for i in range(9):
    images1.append(cv2.imread(f"t2_{i}.jpg"))
    images2.append(cv2.imread(f"t3_{i}.jpg"))
images1 = np.array(images1)
images2 = np.array(images2)


# In[160]:


mx_images1 = mx.nd.array(images1.transpose((0, 3, 1, 2)), ctx=ctx)
mx_images2 = mx.nd.array(images2.transpose((0, 3, 1, 2)), ctx=ctx)


# In[163]:


mx_images1.shape


# In[161]:


get_ipython().run_cell_magic('time', '', 'embs1 = deserialized_net.forward(mx_images1)\nembs2 = deserialized_net.forward(mx_images2)')


# In[164]:


angles = dict()
angles_list = []
for i in range(len(embs1)):
    for j in range(len(embs2)):
        emb1 = embs1[i]
        emb2 = embs2[j]
        angle = get_angle_between_embeddings(emb1, emb2)
        angles[(i, j)] = angle
        angles_list.append(angle.asnumpy())


# In[165]:


angles_array = np.array(angles_list)


# In[167]:


np.sum(angles_array < 1.1)


# In[166]:


for angle in angles_array:
    print(angle)


# In[152]:


np.sum(angles_array < 1.1)


# In[153]:


np.nanmin(angles_array[angles_array >= 0.01])


# In[154]:


plt.hist(angles_array[angles_array >= 0.01])


# In[155]:


sum(angles_array == np.inf)


# In[170]:


identities = 0
for key, value in angles.items():
    if value >= 1.0 and value < 1.3:
        identities += 1
        print(value)
        
        plt.subplot(1, 2, 1)
        plt.imshow(images1[key[0]])
        plt.subplot(1, 2, 2)
        plt.imshow(images2[key[1]])
        #plt.show()
identities


