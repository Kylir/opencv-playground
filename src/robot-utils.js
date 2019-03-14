const Gpio = require('pigpio').Gpio

// Motor A - Left track
const ain1 = new Gpio(24, {mode: Gpio.OUTPUT})
const ain2 = new Gpio(23, {mode: Gpio.OUTPUT})
const pwma = new Gpio(25, {mode: Gpio.OUTPUT})
// Motor B - right track
const bin1 = new Gpio(17, {mode: Gpio.OUTPUT})
const bin2 = new Gpio(27, {mode: Gpio.OUTPUT})
const pwmb = new Gpio(22, {mode: Gpio.OUTPUT})

// Primitives to stop the robot
function stopLeft () {
    pwma.pwmWrite(0)
    ain1.digitalWrite(0)
    ain2.digitalWrite(0)
}
function stopRight () {
    pwmb.pwmWrite(0)
    bin1.digitalWrite(0)
    bin2.digitalWrite(0)
}
function stop () {
    stopLeft()
    stopRight()
}

// Move LEFT
function moveLeftForward (pwm) {
    ain1.digitalWrite(0)
    ain2.digitalWrite(1)
    pwma.pwmWrite(pwm)
}

function moveLeftBackward (pwm) {
    ain1.digitalWrite(1)
    ain2.digitalWrite(0)
    pwma.pwmWrite(pwm)
}

/**
 * Set the left track movement.
 * If pwm is positive it'll go forward.
 * If pwm is negative it'll go backward.
 * @param {number} pwm the amout of pwm
 */
function moveLeft (pwm) {
    if (pwm === 0) {
        stopLeft()
    } else if (pwm > 0) {
        moveLeftForward(pwm)
    } else {
        moveLeftBackward(-pwm)
    }
}

// Move RIGHT
function moveRightForward (pwm) {
    bin1.digitalWrite(0)
    bin2.digitalWrite(1)
    pwmb.pwmWrite(pwm)
}

function moveRightBackward (pwm) {
    bin1.digitalWrite(1)
    bin2.digitalWrite(0)
    pwmb.pwmWrite(pwm)
}

/**
 * Set the left track movement.
 * If pwm is positive it'll go forward.
 * If pwm is negative it'll go backward.
 * @param {number} pwm the amout of pwm
 */
function moveRight (pwm) {
    if (pwm === 0) {
        stopRight()
    } else if (pwm > 0) {
        moveRightForward(pwm)
    } else {
        moveRightBackward(-pwm)
    }
}

/**
 * Will move forward and will try to compensate the deviation
 * @param {Number} pwm The base speed of the robot
 * @param {Number} deviation The distance of the target to the center of the image on the X axis
 * @param {Number} k An adjustment factor to compensate more or less the "recentering"
 */
function moveToTarget (pwm, deviation, k) {
    moveLeft( pwm + (k * deviation) )
    moveRight( pwm - (k * deviation) )
}

/**
 * Make the robot on itself.
 * @param {Number} pwmLeft The speed on the left motor
 * @param {Number} pwmRight The speed on the right motor
 */
function circle (pwmLeft, pwmRight) {
    ain1.digitalWrite(1)
    ain2.digitalWrite(0)

    bin1.digitalWrite(0)
    bin2.digitalWrite(1)

    pwma.pwmWrite(pwmLeft)
    pwmb.pwmWrite(pwmRight)
}

/**
 * The deviation is the X coordinate in pixel of the center of the biggest red object.
 * 
 * A positive deviation means the robot needs to turn right.
 * But for the robot to turn right I need to move the left track forward 
 * and the right one backward.
 * 
 * Same logic: negative deviation => object on the left
 * => right track forward and left track backward
 * @param {number} deviation 
 */
function recenter (deviation) {
    //Do we need to move for small deviations?
    // if (deviation <= X) { stop() }
    moveLeft(deviation)
    moveRight(-deviation)
}


module.exports = {moveLeft, moveLeftForward, moveLeftBackward, moveRight, moveRightForward, moveRightBackward, circle, stopLeft, stopRight, stop, recenter, moveToTarget}
