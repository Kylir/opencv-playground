const Gpio = require('pigpio').Gpio

// Motor A
const ain1 = new Gpio(17, {mode: Gpio.OUTPUT})
const ain2 = new Gpio(27, {mode: Gpio.OUTPUT})
const pwma = new Gpio(22, {mode: Gpio.OUTPUT})
// Motor B
const bin1 = new Gpio(24, {mode: Gpio.OUTPUT})
const bin2 = new Gpio(23, {mode: Gpio.OUTPUT})
const pwmb = new Gpio(25, {mode: Gpio.OUTPUT})

function moveForward (pwmLeft, pwmRight) {
    ain1.digitalWrite(0)
    ain2.digitalWrite(1)

    bin1.digitalWrite(0)
    bin2.digitalWrite(1)

    pwma.pwmWrite(pwmLeft)
    pwmb.pwmWrite(pwmRight)
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

function stop () {
    pwma.pwmWrite(0)
    pwmb.pwmWrite(0)
    ain1.digitalWrite(0)
    ain2.digitalWrite(0)
    bin1.digitalWrite(0)
    bin2.digitalWrite(0)
}

module.exports = {moveForward, moveBackward, circle, stop}
