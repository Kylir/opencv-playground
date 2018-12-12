# OpenCV for NodeJS

This project is an attempt to use OpenCV on the Raspberry Pi to detect coloured shapes.
The ultimate goal would be to drive a small robot using colour detection.


## Install the nodeJS binding for OpenCV.

The project uses the Node module `opencv4node` available [here](https://github.com/justadudewhohacks/opencv4nodejs) to do the binding with OpenCV.

### Windows installation

This module tried to install OpenCV automatically but it failed in my case. So I had to install the Windows version of openCV from the [official reelase website.](https://www.opencv.org/releases.html)

Then the Node module needed to know where to find the different components.
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

### Raspberry Pi installation

The installation on the Raspberry was simpler but took 20 times longer!

I had already installed OpenCV on my Pi 3 A+ so I set the environment variable to skip the build of OpenCV and "just" build the binding.


## Getting help

I'm using two main sources of help:

+ Official OpenCV help page [here](https://docs.opencv.org/3.4.3/)
+ Opencv4Node API documentation page [here](https://justadudewhohacks.github.io/opencv4nodejs/docs/Mat)


## Red Shape detection

Let's start by detecting red shapes in an image.

I'm using a combinaison of two tutorials:

+ This one [here](https://www.pyimagesearch.com/2016/02/08/opencv-shape-detection/) (for Python) focuses on the type of shapes (square, circle, etc.)
+ This other one [here](https://www.bluetin.io/opencv/opencv-color-detection-filtering-python/) is about colour filtering.

The red colour is quite tricky to filter because it is at the upper and lower range of the HSV representation.
We are using two filters, one filtering very low hues and another one filtering very high hues.

The following script finds the contours of red shapes (including orange ones and some brown ones too...)

```js
const image = cv.imread('./images/shapes_black_background.jpg')

const lowRed_mask_up = new cv.Vec3(170, 100, 100)
const highRed_mask_up = new cv.Vec3(180, 255, 255)

const lowRed_mask_down = new cv.Vec3(0, 100, 100)
const highRed_mask_down = new cv.Vec3(15, 255, 255)

// Resize and blur
const processed = image.resize(300, 300).gaussianBlur(new cv.Size(5,5), 0)

// We want to select only the red shapes
const redUp = processed.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_up, highRed_mask_up)
const redLow = processed.cvtColor(cv.COLOR_BGR2HSV).inRange(lowRed_mask_down, highRed_mask_down)
const red = redUp.bitwiseOr(redLow)

// DEBUG
cv.imshowWait('resized and blurred', processed)
cv.imshowWait('red mask', red)

// find contours in the processed image and display info about them
let contours = red.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
console.log(`Found ${contours.length} contours:`)
contours.map(c => {
    console.log(`${c.numPoints} points with area ${c.area}`)
})

```

## Video

WORK IN PROGRESS!

Have a look at `examples/video.js`.

OpenCV is reading the video stream from `/dev/video0`. The driver must be started using the following command:

```bash
sudo modprobe bcm2835-v4l2
```


