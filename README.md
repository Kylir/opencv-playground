# OpenCV for NodeJS

This project is an attempt to use OpenCV on the Raspberry Pi to detect rectangles.
The ultimate goal would be to drive a small robot using shape detection.

## Install the nodeJS binding for OpenCV.

The project uses the Node module `opencv4node` available [here](https://github.com/justadudewhohacks/opencv4nodejs) to do the binding with OpenCV.
This module is trying to install OpenCV automatically but it failed in my case. So I had to install the Windows version of openCV from the [official reelase website.](https://www.opencv.org/releases.html)

Then the Node module needs to know where to find the different components.
I had to set the following environment variables:

```
OPENCV_INCLUDE_DIR=C:\bin\opencv\build\include
OPENCV_LIB_DIR=C:\bin\opencv\build\x64\vc15\lib
OPENCV_BIN_DIR=C:\bin\opencv\build\x64\vc15\bin
```

I also had to set some env variables to disable the auto build

```
OPENCV4NODEJS_DISABLE_AUTOBUILD=1
```

Then I installed the module

```
npm install --save opencv4node
```

## Getting help

I'm using two main sources of help:

+ Official OpenCV help page [here](https://docs.opencv.org/3.4.3/)
+ Opencv4Node API documentation page [here](https://justadudewhohacks.github.io/opencv4nodejs/docs/Mat)


## Testing the installation

To check that everything seems OK, I'm using the following script:


```js
const cv = require('opencv4node')


// load the image and resize it to a smaller factor so that
// the shapes can be approximated better
const mat = cv.imread('./images/shapes.jpg')
const resized = imutils.resize(image, 300)
const ratio = image.shape[0] / float(resized.shape[0])
 
// convert the resized image to grayscale, blur it slightly,
// and threshold it
const gray = cv.cvtColor(resized, cv.COLOR_BGR2GRAY)
const blurred = cv.GaussianBlur(gray, (5, 5), 0)
const thresh = cv.threshold(blurred, 60, 255, cv.THRESH_BINARY)[1]
 
// find contours in the thresholded image
let cnts = cv.findContours(thresh.copy(), cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)


```


## Shape detection

Let's start by detecting squares in an image.
I'm using this nice tutorial (for Python) I found [here](https://www.pyimagesearch.com/2016/02/08/opencv-shape-detection/) to detect shapes.

16509530- 26th of nov 9:30
Ely 

Forms
Mariage cert
Full Birth certs 

