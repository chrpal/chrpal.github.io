// Get references to UI elements
let connectButton = document.getElementById('connect');
let emergencyButton = document.getElementById("emergency");
let disconnectButton = document.getElementById('disconnect');

let terminalContainer = document.getElementById('terminal');
let sendForm = document.getElementById('send-form');
let inputField = document.getElementById('input');

// Characteristic object cache
let characteristicCache = null;
let deviceCache = null;

// Connect to the device on Connect button click
connectButton.addEventListener('click', function() {
  connect();
});

emergencyButton.addEventListener("click", function(){
  emergency();
});

// Disconnect from the device on Disconnect button click
disconnectButton.addEventListener('click', function() {
  disconnect();
});

// Handle form submit event
sendForm.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form sending
  send(inputField.value); // Send text field contents
  inputField.value = '';  // Zero text field
  inputField.focus();     // Focus on text field
});

// Launch Bluetooth device chooser and connect to the selected
function connect() {
  let filters = [];
  filters.push({name: "Zigbee_UART"});
  let options = {};
  options.filters = filters;
  options.acceptAllDevices = false;
  
  deviceCache = requestBluetoothDevice(options)
      .then(device => connectDeviceAndCacheCharacteristic(device))
      //.then(characteristic => startNotifications(characteristic))
      .catch(error => log(error));
}

function emergency()
{
  
}

// Disconnect from the connected device
function disconnect() {
  //
}

// Send data to the connected device
function send(data) {
  //
}


function requestBluetoothDevice(options) {
  log('Requesting bluetooth device...');

  return navigator.bluetooth.requestDevice(options)
      .then(device => {
        log('"' + device.name + '" bluetooth device selected');
        deviceCache = device;

        return deviceCache;
      });
}

// Connect to the device specified, get service and characteristic
function connectDeviceAndCacheCharacteristic(device) {
  if (device.gatt.connected && characteristicCache) {
    return Promise.resolve(characteristicCache);
  }

  log('Connecting to GATT server...');

  return device.gatt.connect().
      then(server => {
        log('GATT server connected, getting service...');

        return server.getPrimaryService(0xFFE0);
      }).
      then(service => {
        log('Service found, getting characteristic...');

        return service.getCharacteristic(0xFFE1);
      }).
      then(characteristic => {
        log('Characteristic found');
        characteristicCache = characteristic;

        return characteristicCache;
});
}

// Enable the characteristic changes notification
function startNotifications(characteristic) {
  log('Starting notifications...');

  return characteristic.startNotifications().
      then(() => {
        log('Notifications started');
});
}

// Output to terminal
function log(data, type = '') {
  terminalContainer.insertAdjacentHTML('beforeend',
'<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}
