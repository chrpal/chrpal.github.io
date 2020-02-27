
let HeartBeatValue = 0;
let characteristics = {};
let device = null;
let gatt_server = null;
let main_service = null;

let callbacks = {};

function RTag_Register_MeasureState_Delegator(cb)
{
	callbacks["measure_state"] = cb;
}

function RTag_Register_HeartbeatRx_Delegator(cb)
{
	callbacks["heartbeat_rx"] = cb;
}

function RTag_Find()
{
		let filters = [];
  filters.push({name: "RTAG"});
  //filters.push({services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']});
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

function RTag_Connect()
{
	device = RTag_Find()
	if (device.gatt.connected && characteristicCache) {
		return Promise.resolve(characteristicCache);
	}
	gatt_server = device.gatt.connect();
	main_service = gatt_server.getPrimaryService("00000000-0911-0001-9080-bf229b4e7000");
	characteristics["register"] = main_service.getCharacteristic('00000000-0912-0001-9080-bf229b4e7000');
	characteristics["measure_state"] = main_service.getCharacteristic('00000000-0913-0001-9080-bf229b4e7000');
	characteristics["measure_node_count"] = main_service.getCharacteristic('00000000-0914-0001-9080-bf229b4e7000');
	characteristics["measure_request"] = main_service.getCharacteristic('00000000-0915-0001-9080-bf229b4e7000');
	characteristics["heartbeat_tx"] = main_service.getCharacteristic('00000000-0916-0001-9080-bf229b4e7000');
	characteristics["heartbeat_rx"] = main_service.getCharacteristic('00000000-0917-0001-9080-bf229b4e7000');
	characteristics["role"] = main_service.getCharacteristic('00000000-0918-0001-9080-bf229b4e7000');
	characteristics["whoami"] = main_service.getCharacteristic('00000000-0919-0001-9080-bf229b4e7000');
	
	characteristics["heartbeat_rx"].startNotifications();
	characteristics["heartbeat_rx"].addEventListener('characteristicvaluechanged', RTag_HeartbeatRxChangedEventListener);
	characteristics["measure_state"].startNotifications();
	characteristics["measure_state"].addEventListener('characteristicvaluechanged', RTag_MeasureStateChangedEventListener);
}

function RTag_Disconnect()
{
}

function RTag_RegisterToNetwork()
{
}

function RTag_StartPingMeasurement()
{
}

function RTag_WriteHeartbeat()
{
	characteristics["heartbeat_tx"].writeValue(Uint8Array.of(HeartBeatValue));
	HeartBeatValue++;
}

function RTag_SetRoleAsGW()
{
	characteristics["role"].writeValue(Uint8Array.of(2));
}

function RTag_SetRoleAsRepeater()
{
	characteristics["role"].writeValue(Uint8Array.of(0));
}

function RTag_SetRoleAsTag()
{
	characteristics["role"].writeValue(Uint8Array.of(1));
}

function RTag_ActivateWhoAmI()
{
	characteristics["whoami"].writeValue(Uint8Array.of(1));
}

function RTag_DeactivateWhoAmI()
{
	characteristics["whoami"].writeValue(Uint8Array.of(0));
}

function RTag_MeasureStateChangedEventListener(event)
{
	val = event.target.value;
	callbacks["measure_state"](val);
}

function RTag_HeartbeatRxChangedEventListener(event)
{
	val = event.target.value;
	callbacks["heartbeat_rx"](val);
}
