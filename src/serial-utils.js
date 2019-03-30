const raspi = require('raspi')
const Serial = require('raspi-serial').Serial

let serial

raspi.init(() => {
  serial = new Serial({portId: '/dev/ttyS0'})
  
  serial.open(() => {
    serial.on('data', (data) => {
      process.stdout.write(data)
    })
  });
})

function serialWrite (data) {
  const strData = data.join()
  serial.write(strData)
}

module.exports = { serialWrite }
