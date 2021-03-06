/*var TTNApi = 0;

require(['./ttnapi/index.js'], function (ttnapi) {
    TTNApi = ttnapi.ApiClient.instance;
    InitializeAll();
});*/

InitializeAll();

function InitializeAll()
{
  /*TTNApi.basepath = "https://rescuetag.data.thethingsnetwork.org/";
  TTNApi.authentications.value = "ttn-account-v2.yoRblsitvK4O5-Y31iQebd2j3RGslXrCwvCuM0qxN3Y";*/

  // Get references to UI elements
  let connectButton = document.getElementById('connect');
  let disconnectButton = document.getElementById('disconnect');
    
  let emergencyButton = document.getElementById("emergency");
  let linkbrokenButton = document.getElementById("linkbroken");
  let overstressButton = document.getElementById("overstress");
    
  let resetButton = document.getElementById('reset');

  let terminalContainer = document.getElementById('terminal');
  let sendForm = document.getElementById('send-form');
  let inputField = document.getElementById('input');

  // Characteristic object cache
  let characteristicCache = null;
  let deviceCache = null;
    
  let heartbeattimer = null;

  linkbrokenButton.addEventListener('click', function() {
    linkbroken();
  });
    
  overstressButton.addEventListener('click', function() {
    overstress();
  });
    
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
    window.clearInterval(heartbeattimer);
  });

  resetButton.addEventListener('click', function() {
    reset();
  });

  // Handle form submit event
  sendForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form sending
    send(inputField.value); // Send text field contents
    inputField.value = '';  // Zero text field
    inputField.focus();     // Focus on text field
  });
}

// Launch Bluetooth device chooser and connect to the selected
function connect() {
  heartbeattimer = window.setInterval(function() {heartbeat();}, 1000);
  deviceCache = requestBluetoothDevice()
      .then(device => connectDeviceAndCacheCharacteristic(device))
      //.then(characteristic => startNotifications(characteristic))
      .catch(error => log(error));
}

function getRescueSignal()
{
}

function emergency()
{
  send('fallen');
}

function linkbroken()
{
    send('linkbroken');
}

function overstress()
{
    send('overstress');
}

function heartbeat()
{
    send('heartbeat');
}

function reset()
{
  send('reset');
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
  filters.push({name: "Rescue Tag"});
  filters.push({services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']});
  let options = {};
  options.filters = filters;
  //options.optionalServices = ["e50e24dcca9e-e0a9-f393-b5a3-6e400001"];
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

        return server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
      }).
      then(service => {
        log('Service found, getting characteristic...');
                                          
        return service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
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
  //terminalContainer.insertAdjacentHTML('beforeend',
//'<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}
