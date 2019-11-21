from os import listdir
from os.path import isdir
from PIL import Image
from matplotlib import pyplot
from numpy import savez_compressed
from numpy import asarray
from mtcnn.mtcnn import MTCNN

# create the detector, using default weights
detector = MTCNN()


# extract a single face from a given photograph X
def extract_face(filename, required_size=(160, 160)):
	# load image from file
	print(filename)
	image = Image.open(filename)
	# convert to RGB, if needed
	image = image.convert('RGB')
	# convert to array
	pixels = asarray(image)
	# detect faces in the image
	results = detector.detect_faces(pixels)
	if not results:
		return None, None
	print(results)
	# extract the bounding box from the first face
	x1, y1, width, height = results[0]['box']
	# bug fix
	x1, y1 = abs(x1), abs(y1)
	x2, y2 = x1 + width, y1 + height
	# extract the face
	face = pixels[y1:y2, x1:x2]
	# resize pixels to the model size
	image = Image.fromarray(face)
	image = image.resize(required_size)
	face_array = asarray(image)
	return face_array, asarray([x1, y1, x2, y2])

# extract all faces from a given photograph Y
def extract_face_test(filename, required_size=(160, 160)):
	# load image from file
	face_arrays = list()
	face_boxes = list()
	print(filename)
	image = Image.open(filename)
	# convert to RGB, if needed
	image = image.convert('RGB')
	# convert to array
	pixels = asarray(image)
	# detect faces in the image
	results = detector.detect_faces(pixels)
	if not results:
		return None, None

	for result in results:
		if result['confidence'] < 0.8 :
			continue
		print(result)
		# extract the bounding box from the first face
		x1, y1, width, height = result['box']
		# bug fix
		x1, y1 = abs(x1), abs(y1)
		x2, y2 = x1 + width, y1 + height
		# extract the face
		face = pixels[y1:y2, x1:x2]
		# resize pixels to the model size
		image = Image.fromarray(face)
		image = image.resize(required_size)
		face_array = asarray(image)
		face_arrays.append(face_array)
		face_boxes.append([x1, y1, x2, y2])

	return face_arrays, face_boxes


	# load images and extract faces for all images in a directory
def load_faces(directory):
	faces = list()
	paths, boxes = list(), list()
	# enumerate files
	for filename in listdir(directory):
		# path
		path = directory + filename
		# get face
		face, box = extract_face(path)
		if face is not None:
			# store
			faces.append(face)
			paths.append(filename)
			boxes.append(box)
	return faces, paths, boxes

# load images and extract faces for all images in a directory
def load_faces_test(directory):
	faces = list()
	paths = list()
	boxes = list()
	# enumerate files
	for filename in listdir(directory):
		# path
		path = directory + filename
		# get face
		face, box = extract_face_test(path)
		if face is not None:
			# store
			file_path = [filename for _ in range(len(face))]
			faces.extend(face)
			paths.extend(file_path)
			boxes.extend(box)
	return faces, paths, boxes

# load a dataset that contains one subdir for each class that in turn contains images
def load_dataset(directory):
	X, y = list(), list()
	face_box, files = list(), list()
	# enumerate folders, on per class
	for subdir in listdir(directory):
		# path
		path = directory + subdir + '/'
		# skip any files that might be in the dir
		if not isdir(path):
			continue
		# load all faces in the subdirectory
		faces, paths, boxes = load_faces(path)
		# create labels
		labels = [subdir for _ in range(len(faces))]
		# summarize progress
		print('>loaded %d examples for class: %s' % (len(faces), subdir))
		# store
		X.extend(faces)
		y.extend(labels)
		files.extend(paths)
		face_box.extend(boxes)
	return asarray(X), asarray(y), asarray(files), asarray(face_box)
 
# load a dataset that contains one subdir for each class that in turn contains images
def load_dataset_test(directory):
	X, y = list(), list()
	files = list()
	face_box = list()
	# enumerate folders, on per class
	for subdir in listdir(directory):
		# path
		path = directory + subdir + '/'
		# skip any files that might be in the dir
		if not isdir(path):
			continue
		# load all faces in the subdirectory
		faces, paths, boxes = load_faces_test(path)
		# create labels
		labels = [subdir for _ in range(len(faces))]
		# summarize progress
		print('>loaded %d examples for class: %s' % (len(faces), subdir))
		# store
		X.extend(faces)
		y.extend(labels)
		files.extend(paths)
		face_box.extend(boxes)
	return asarray(X), asarray(y), asarray(files), asarray(face_box)
 
# load train dataset
trainX, trainy, train_file, train_boxes = load_dataset('ASC19-dataset/train/')
print(trainX.shape, trainy.shape)
# load test dataset
testX, testy, test_file, test_boxes = load_dataset_test('ASC19-dataset/test/')
# save arrays to one file in compressed format
savez_compressed('friend-dataset.npz', trainX, trainy, train_file, train_boxes, testX, testy, test_file, test_boxes)
