import sys
import matplotlib.pyplot as plt
import numpy as np


npz_data = np.load(sys.argv[1])
images = npz_data[sys.argv[2]]

print(images.shape)

i = 1
for image in images:
	plt.subplot(3, 10, i)
	plt.axis('off')
	plt.imshow(images[i-1])
	i = i + 1
	if i > 30:
		break

plt.show()
