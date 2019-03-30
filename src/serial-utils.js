// const raspi = require('raspi')
// const Serial = require('raspi-serial').Serial
// const util = require('util');

// const init = util.promisify(raspi.init)
// const open = util.promisify()

// function serialInit() {

//   init().then()

//   init(() => {
//     serial = new Serial({portId: '/dev/ttyS0'})
    
//     serial.open().then() => {
//       serial.on('data', (data) => {
//         process.stdout.write(data)
//       })
//     });
//   })
// }

// function serialWrite (serial, data) {
//   const strData = data.join()
//   serial.write(strData)
// }

// module.exports = { serialWrite, serialInit }

// // -----------------------------------------

// let serial

// raspi.init(() => {
//   serial = new Serial({portId: '/dev/ttyS0'})
  
//   serial.open(() => {
//     serial.on('data', (data) => {
//       process.stdout.write(data)
//     })
//   });
// })

// function serialWrite (data) {
//   const strData = data.join()
//   serial.write(strData)
// }

// module.exports = { serialWrite }





