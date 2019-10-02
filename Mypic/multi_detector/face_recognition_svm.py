# Train multiple images per person
# Find and recognize faces in an image using a SVC with scikit-learn

import face_recognition
from sklearn import svm
import os
import cv2
import matplotlib.pyplot as plt

# Training the SVC classifier

# The training data would be all the face encodings from all the known images and the labels are their names
encodings = []
names = []

# Training directory
train_dir = os.listdir('train_dir/')

# Loop through each person in the training directory
for person in train_dir:
	pix = os.listdir("train_dir/" + person)

	# Loop through each training image for the current person
	for person_img in pix:
		print("[PROCESS] train_dir/" + person + "/" + person_img)
		# Get the face encodings for the face in each image file
		face = face_recognition.load_image_file("train_dir/" + person + "/" + person_img)
		face_bounding_boxes = face_recognition.face_locations(face)

		#If training image contains none or more than faces, print an error message and exit
		if len(face_bounding_boxes) < 1:
			print(person + "/" + person_img + " contains none and can't be used for training.")
			continue
		else:
			face_enc = face_recognition.face_encodings(face)[0]
			# Add face encoding for current image with corresponding label (name) to the training data
			encodings.append(face_enc)
			names.append(person)

# Create and train the SVC classifier
clf = svm.SVC(gamma='scale')
clf.fit(encodings,names)

for j in range(1, 8):
	# Load the test image with unknown faces into a numpy array
	test_image = face_recognition.load_image_file('test_img/' + str(j) + '.jpg')
	print('[TEST] img : ' + str(j) + '.jpg')

	# Find all the faces in the test image using the default HOG-based model
	face_locations = face_recognition.face_locations(test_image)
	no = len(face_locations)
	print("Number of faces detected: ", no)

	# Predict all the faces in the test image using the trained classifier
	print("Found:")
	for i in range(no):
		test_image_enc = face_recognition.face_encodings(test_image)[i]
		name = clf.predict([test_image_enc])
		print(*name)

	# Show images
	plt.subplot(2, 4, j)
	plt.axis('off')
	plt.imshow(test_image)

plt.show()
