const Gpio = require('pigpio').Gpio

// Motor A
const ain1 = new Gpio(17, {mode: Gpio.OUTPUT})
const ain2 = new Gpio(27, {mode: Gpio.OUTPUT})
const pwma = new Gpio(22, {mode: Gpio.OUTPUT})
// Motor B
const bin1 = new Gpio(24, {mode: Gpio.OUTPUT})
const bin2 = new Gpio(23, {mode: Gpio.OUTPUT})
const pwmb = new Gpio(25, {mode: Gpio.OUTPUT})


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
function moveRight (pwm) {
    if (pwm === 0) {
        stopRight()
    } else if (pwm > 0) {
        moveRightForward(pwm)        
    } else {
        moveRightBackward(-pwm)
    }
}

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

function moveBackward (pwmLeft, pwmRight) {
    ain1.digitalWrite(1)
    ain2.digitalWrite(0)

    bin1.digitalWrite(1)
    bin2.digitalWrite(0)

    pwma.pwmWrite(pwmLeft)
    pwmb.pwmWrite(pwmRight)
}

function circle (pwmLeft, pwmRight) {
    ain1.digitalWrite(1)
    ain2.digitalWrite(0)

    bin1.digitalWrite(0)
    bin2.digitalWrite(1)

    pwma.pwmWrite(pwmLeft)
    pwmb.pwmWrite(pwmRight)
}

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

module.exports = {moveLeft, moveLeftForward, moveLeftBackward, moveRight, moveRightForward, moveRightBackward, moveBackward, circle, stopLeft, stopRight, stop}
