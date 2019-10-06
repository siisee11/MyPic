import sys
import matplotlib.pyplot as plt
import numpy as np
import cv2
import argparse

ap = argparse.ArgumentParser()
ap.add_argument("-f", "--file", required=True,
		help="path to npz file")
ap.add_argument("-t", "--type", required=True,
		help="test or train")
args = ap.parse_args()

npz_data = np.load(args.file)

images = npz_data['arr_0']
tags = npz_data['arr_1']
file_name = npz_data['arr_2']
boxes = npz_data['arr_3']

if args.type == 'test':
	images = npz_data['arr_4']
	tags = npz_data['arr_5']
	file_name = npz_data['arr_6']
	boxes = npz_data['arr_7']

print(images.shape)
print(tags.shape)
print(file_name.shape)
print(boxes.shape)

i = 1
for image in images:
	location = 'friend-dataset/' + str(args.type) + '/' + tags[i-1] + '/' + file_name[i-1]
	print(location)
	original = cv2.imread(location, cv2.IMREAD_COLOR)
	box = boxes[i-1]
	(startX, startY, endX, endY) = box.astype("int")
	y = startY - 10 if startY - 10 > 10 else startY + 10
	cv2.rectangle(original, (startX, startY, endX - startX, endY - startY), (0,0, 255), 3)
	cv2.putText(original, tags[i-1], (box[0], y),
			cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 3)
	small_pic = cv2.resize(original, dsize=(0, 0), fx=0.2, fy=0.2, interpolation=cv2.INTER_LINEAR)
	cv2.imshow("Image", small_pic)

	k = cv2.waitKey(0)
	if k == 27: # esc key
		cv2.destroyAllWindow()

	i = i + 1
	if i > 30:
		break

#plt.show()
