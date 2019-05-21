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
  deviceCache = requestBluetoothDevice()
      .then(device => connectDeviceAndCacheCharacteristic(device))
      //.then(characteristic => startNotifications(characteristic))
      .catch(error => log(error));
}

function emergency()
{
  
}

// Disconnect from the connected device
function disconnect() {
  if (deviceCache) {
    log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');
    deviceCache.removeEventListener('gattserverdisconnected',
        handleDisconnection);

    if (deviceCache.gatt.connected) {
      deviceCache.gatt.disconnect();
      log('"' + deviceCache.name + '" bluetooth device disconnected');
    }
    else {
      log('"' + deviceCache.name +
          '" bluetooth device is already disconnected');
    }
}

function handleDisconnection(event) {
  let device = event.target;

  log('"' + device.name +
      '" bluetooth device disconnected, trying to reconnect...');

  connectDeviceAndCacheCharacteristic(device).
      then(characteristic => startNotifications(characteristic)).
      catch(error => log(error));
}
  
// Send data to the connected device
function send(data) {
   data = String(data);

  if (!data || !characteristicCache) {
    return;
  }

  writeToCharacteristic(characteristicCache, data);
  log(data, 'out');
}

function writeToCharacteristic(characteristic, data) {
  characteristic.writeValue(new TextEncoder().encode(data));
}

function requestBluetoothDevice() {
  log('Requesting bluetooth device...');

  let filters = [];
  filters.push({name: "Zigbee_UART"});
  let options = {};
  options.filters = filters;
  // options.acceptAllDevices = false;
  
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

        return server.getPrimaryService("6E400001-B5A3-F393-E0A9-E50E24DCCA9E");
      }).
      then(service => {
        log('Service found, getting characteristic...');

        return service.getCharacteristic("6E400002-B5A3-F393-E0A9-E50E24DCCA9E");
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
