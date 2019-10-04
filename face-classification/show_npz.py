import sys
import matplotlib.pyplot as plt
import numpy as np
import cv2


npz_data = np.load(sys.argv[1])

#images = npz_data['arr_0']
#tags = npz_data['arr_1']

images = npz_data['arr_2']
tags = npz_data['arr_3']
file_name = npz_data['arr_4']
boxes = npz_data['arr_5']

print(images.shape)

i = 1
for image in images:
	box = boxes[i-1]
	y = box[1] - 10 if box[1] - 10 > 10 else box[1] + 10
	cv2.rectangle(image, (box[0], box[1], box[2], box[3]), (0,0, 255), 2)
	cv2.putText(image, tags[i-1], (box[0], y),
			cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
	cv2.imshow("Image", image)
	cv2.waitKey(0)
#	plt = plt.subplot(3, 10, i)
#	plt.imshow(images[i-1])
#	plt.title(file_name[i-1])

	i = i + 1
	if i > 30:
		break

#plt.show()
