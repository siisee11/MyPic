# develop a classifier for the 5 Celebrity Faces Dataset
from random import choice
import numpy as np
from numpy import load
from numpy import expand_dims
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import Normalizer
from sklearn.svm import SVC
from matplotlib import pyplot
from sklearn.metrics import classification_report, accuracy_score
import sys
import shutil
import os

target = sys.argv[1]

if not os.path.exists('result'):
	os.makedirs('result')

if not os.path.exists('result/' + target):
	os.makedirs('result/' + target)

# load faces
data = load('friend-dataset.npz')
testX_faces, file_names = data['arr_2'], data['arr_4']
print(file_names)

# load face embeddings
data = load('friend-embeddings.npz')
trainX, trainy, testX, testy = data['arr_0'], data['arr_1'], data['arr_2'], data['arr_3']

# normalize input vectors
in_encoder = Normalizer(norm='l2')
trainX = in_encoder.transform(trainX)
testX = in_encoder.transform(testX)

# label encode targets
out_encoder = LabelEncoder()
out_encoder.fit(trainy)

for label in np.unique(testy):
	if label not in out_encoder.classes_: # unseen label 데이터인 경우( )
		out_encoder.classes_ = np.append(out_encoder.classes_, label) # 미처리 시 ValueError발생

trainy = out_encoder.transform(trainy)
testy = out_encoder.transform(testy)

# fit model
model = SVC(kernel='linear', probability=True, C=1000)
model.fit(trainX, trainy)

# test model on a all example from the test dataset
selection = choice([i for i in range(testX.shape[0])])

for selection in range(testX.shape[0]-1):
	random_face_pixels = testX_faces[selection]
	random_face_emb = testX[selection]
	random_face_class = testy[selection]
	random_face_name = out_encoder.inverse_transform([random_face_class])
	random_file_name = file_names[selection]

	# prediction for the face
	samples = expand_dims(random_face_emb, axis=0)
	yhat_class = model.predict(samples)
	yhat_prob = model.predict_proba(samples)

	# get name
	class_index = yhat_class[0]
	class_probability = yhat_prob[0,class_index] * 100
	predict_names = out_encoder.inverse_transform(yhat_class)

	src = 'friend-dataset/test/' + random_face_name[0] + '/' + random_file_name
	dest = 'result/' + target + '/' + random_file_name

	if predict_names[0] == target:
		print('[COPY] ' + src + ' => ' + dest) 
		shutil.copy2(src, dest)

	print('Predicted: %s (%.3f)' % (predict_names[0], class_probability))
	print('Expected: %s' % random_face_name[0])

# plot for fun
pyplot.imshow(random_face_pixels)
title = '%s (%.3f)' % (predict_names[0], class_probability)
pyplot.title(title)
pyplot.show()
