# Homebridge ISY

Note: The npm package has been changed to homebridge-ISY[https://www.npmjs.com/package/homebridge-isy] (ISY API lib is now called [isy-nodejs](https://www.npmjs.com/package/isy-nodejs))

Fork of homebridge-isy-js by [rodtoll](https://github.com/rodtoll/homebridge-isy-js.git)

[![Build Status](https://api.travis-ci.org/rodtoll/homebridge-isy-js.svg?branch=master)](https://api.travis-ci.org/rodtoll/isy-js.svg?branch=master)

(C) Rod Toll 2015-2017, Licensed under the MIT-LICENSE.

# Major Updates

Requires [Homebridge Beta](https://github.com/homebridge/homebridge/tree/beta). Please see revised installation notes below.

### New Functionality:

- Support for ISY 5.0.16+

- Configurable using [Homebridge Config-UI X](https://www.npmjs.com/package/homebridge-config-ui-x) (This is a work in progress, but you'll eventually be able to install homebridge-isy from Homebridge Config directly)

- Pulls folders and notes from ISY
    1. Default behavior is that folder names will be appended to the device name e.g. if "Vent Switch" is in folder "Bathroom", the display name passed to homebridge will be Bathroom Switch Vent.
    2. If notes are in the ISY and have been populated fully, location and spoken name will be used to render the display name. E.g. if Bathroom.Switch.Vent has been updated with Bathroom as the Location and Vent as the spoken name, then Bathroom Vent will be used as the display name.

- Additional parameters available to filter devices (Device Family (e.g. Insteon, Zigbee, ZWave, etc...), Folder (ref. above), ISY Type Code (e.g. 15.1.1.1) and NodeDef (KeypadButton_ADV) if you want to use either NodeDef or Type Code please let me know)

- Global Renames (TransformNames) - i.e. replace any instance of '.' with ' ' -> Switch.Vent -> Switch Vent or remove any instance of certain words e.g. Bathroom.Switch.Vent -> Bathroom Vent... see config sample below:

- Support for additional devices (Need Testers):
     Insteon Thermostat/Thermostat Adapters
     Leak Sensors
     CO/Smoke Bridges (WIP)
     Remotes

### Bug Fixes/Under the hood:

- Uses more robust handling for device status changes from ISY and sending updates to ISY (e.g. using updateCharacteristic vs. setCharacteristic to not fire events)
- Migrated to typescript
- Upgraded to use latest version of hap-nodejs (requires homebridge-beta).

### TODO:

- Re-add support for non-insteon/elk native devices (ZWave & Zigbee)
- Test garage door openers & MorningLinc locks (Need Testers)
- Add support for Zigbee Devices
- Add Keypad Button support (Keypad Buttons will map to Stateless Programmable Switches)
- Incorporate individual device status in scene definitions
- Create configurable mappings for IOLinc to other types of accessories (e.g. curtains, sprinkler control & garage door openers)

### Future Work:

- Add NodeServer support. May implement or may implement in ISY-nodejs only, as using native homebridge plugins may be better solution. E.g. for nest devices, you would use a Nest NodeServer to integrate with the ISY, and the Nest homebridge plugin to integrate with HomeKit.

-----------

## Installation

1. Install homebridge using: npm install -g homebridge@beta
2. Install this plugin using: npm install -g homebridge-isy
3. Update your configuration file. See sampleconfig.json in this repository for a sample. Please note that the platform name has been changed to "ISY".

IMPORTANT NOTE: Since the package and platform names are different (and the way accessory IDs are assigned), you can have both original version [homebridge-isy-js](https://www.npmjs.com/package/homebridge-isy-js) and homebridge-isy installed (you will have two platform sections (one ISY and the other isy-js) your homebridge config). this is something I recommend if you have a lot of devices configured currently, and anything like the garage door opener/locks/elk that need to be tested. This way, you can wait to uninstall the old version once you've got everything configured and working correctly.

## Requirements

Only the ISY 994 and newer devices running 5.0.16+ are supported. The ISY 99i device is no longer supported as this library depends on a later version of the REST/Websocket interface.

## Configuration

Configuration sample (please refer to the homebridge-config-ui-x readme to add a section for that, and refer to the above if you want to add an additional section for homebridge-isy-js):
     "platforms": [
        {
            "platform": "ISY",
            "name": "ISY",
            "host": "10.0.1.12",
            "username": "admin",
            "password": "password",
            "elkEnabled": true,
            "useHttps": false,
            "debugLoggingEnabled": false,
            "includeAllScenes": false,
            "includedScenes": [
                "27346"
            ],
            "garageDoors": [
                { "address": "17 79 81 1", "name": "Garage Door", "timeToOpen": 12000 }
            ],
            "ignoreDevices": [
                { "nameContains": "ApplianceLinc"},
                { "address": "17 79 81 A"},
                { "family": "ZigBee" },
                { "folder": "Linking Scenes" },
                { "nodeDef": "KeypadButton_ADV" },
                { "nameContains": "Keypad", "lastAddressDigit": "2" }
            ],
            "renameDevices": [
                { "nameContains": "BadName", "newName": "Good name" }
            ],
             "transformNames": {
             "remove": [
                 "Dimmer",
                 "Switch",
                 "Fan "
             ],
             "replace": [{
                 "replace": ".",
                 "with": " "
             }]
         }

        }
     ]


Fields:
* "platform" - Must be set to isy-js
* "name" - Can be set to whatever you want
* "host" - IP address of the ISY
* "username" - Your ISY username
* "password" - Your ISY password
* "elkEnabled" - true if there is an elk alarm panel connected to your ISY
* "useHttps" - true if you want to use a https connection to the ISY. Only use if you have HTTPS setup with a proper cert.
* "debugLoggingEnabled" - true if you want debug logs to be dumped to the console.
* "garageDoors" - Specifies a list of devices which are I/O Lincs which should be treated as a garage door opener by HomeKit. The entry takes the form of one entry per device. (NOTE: In ISY an IO Linc is treated as two devices, you only need one entry for each IO Linc).
Each entry should have the following elements: "address" - the address of the IO Linc primary device (the .1 device), "name" - Name to give the garage door device, "timeToOpen" - The number of ms before a door which is opening should be considered open.
* "includeAllScenes" - true if you want the platform to expose all the scenes. Setups usually have a LOT of scenes any only 100 devices are supported from a bridge. It is recommended you proactively include the scenes you want in includedScenes.
* "includedScenes" - An array of the addresses of the scenes you want to include as lighting devices.
* "ignoreDevices" - Array of objects specifying criteria for screening out devices from the network. nameContains is the only required criteria. If the other criteri are blank all devices will match those criteria (providing they match the name criteria).
* (Under ignoreDevices) "nameContains" - Specifies a substring to check against the names of the ISY devices. Required field for the criteria.
* (Under ignoreDevices) "lastAddressDigit" - Specifies a single digit in the ISY address of a device which should be used to match the device. Example use of this is for composite devices like keypads so you can screen out the non-main buttons.
* (Under ignoreDevices) "address" - ISY address to match.
* "renameDevices" - Array of objects specifying devices you want to rename based on their address or name.
* (Under renameDevices) "nameContains" - Specifies a substring to check against the names of the ISY devices. Required field for the criteria.
* (Under renameDevices) "address" - ISY address to match.
* (Under renameDevices) "newName" - New name to give to the device.

```
Examples:

{ "nameContains": "Keypad", "lastAddressDigit": "2", "address": "" } - Ignore all devices which have the word Keypad in their name and whose last address digit is 2.
{ "nameContains": "Remote", "lastAddressDigit": "", "address": "" } - Ignore all devices which have the word Remote in their name
{ "nameContains": "", "lastAddressDigit": "", "address": "15 5 3 2"} - Ignore the device with an ISY address of 15 5 3 2.
```

## Implementation Notes

* Scenes will not show as on until all light devices are on. This allows the UI to send an 'on' request to light up the rßest of them.
* Garage door openers (in this case an I/O Linc used in a garage kit) are complex to get correct. We only have the current state of the contact
 sensor to determine current status. In particular, if you startup the system while the garage door is changing state (opening or closing)
 the code will likely get the state incorrect. If you get into this state, close the garage door and restart homebridge. The garage door is assumed open at startup and closed at startup if the contact sensor
 says the door is open or closed respectively.

-----------

# History

 * 0.2.0 - Development resumed.
    - Support for v5.0.12+
    - Support for Insteon Thermostat/Insteon Thermostat Adapter added
    - Fixed characteristic update logic to capture externally initiated changes w/o triggering update back to isy.
    - Requires new version of [isy-js](https://github.com/pradeepmouli/isy-js.git)
 * 0.1.9 - (Rodtoll) Active development ended.
 * 0.1.8 - Fixed crash in tests (race condition) and fixed crash in garage door device.
 * 0.1.7 - Fixed crash when there is no ignoreDevices entry. Also added new renameDevices section to enable device renaming. Added note to highlight ISY 99 is no longer supported, you needed an ISY 994 or newer. Added checks to ensure device list doesn't exceed 100 devices. Simplified ignore syntax so blank elements no longer needed.
 * 0.1.6 - Addressed crash when identify called on lights.
 * 0.1.4 - Release for testing alternative garage logic. No change for anyone wanting to use it with the standard logic.
 * 0.1.3 - Added improved debug output. Fixed bug where plugin would crash when there are no garage door opener present.
 * 0.1.2 - Added garage door opener support
 * Previous - Changes not tracked in this document.
