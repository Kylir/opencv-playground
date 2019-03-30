const raspi = require('raspi');
const Serial = require('raspi-serial').Serial;
 
raspi.init(() => {
  const serial = new Serial({portId: '/dev/ttyS0'});
  serial.open(() => {
    serial.on('data', (data) => {
      process.stdout.write(data);
    });
    serial.write('Hello from raspi-serial');
  });
});
