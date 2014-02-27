// Copyright (c) 2014, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

# org.dartlang.thermometer

This plugin provides access to the device's thermometer.

## Installation

    cordova plugin add org.dartlang.thermometer

## Supported Platforms

- Android

## Methods

- navigator.thermometer.getCurrentTemperature
- navigator.thermometer.watchTemperature
- navigator.thermometer.clearWatch

## Objects

- Temperature

## navigator.thermometer.getCurrentTemperature

Get the current ambient temperature.

The temperature values are returned to the `thermometerSuccess`
callback function.

    navigator.thermometer.getCurrentTemperature(thermometerSuccess, thermometerError);


### Example

    function onSuccess(temperature) {
        alert('Temperature: ' + temperature.val + '\n' +
              'Timestamp: '   + temperature.timestamp + '\n');
    };

    function onError() {
        alert('onError!');
    };

    navigator.thermometer.getCurrentTemperature(onSuccess, onError);

## navigator.thermometer.watchTemperature

Retrieves the device's current `Temperature` at a regular interval, executing
the `thermometerSuccess` callback function each time. Specify the interval in
milliseconds via the `thermometerOptions` object's `frequency` parameter.

The returned watch ID references the thermometers's watch interval,
and can be used with `navigator.thermometer.clearWatch` to stop watching the
accelerometer.

    var watchID = navigator.thermometer.watchTemperature(thermometerSuccess,
                                                    thermometerError,
                                                    [thermometerOptions]);

- __thermometerOptions__: An object with the following optional keys:
- __frequency__: How often to retrieve the `Temperature` in milliseconds. _(Number)_ (Default: 10000)


###  Example

    function onSuccess(temperature) {
        alert('Temperature: '  + temperature.val + '\n' +
              'Timestamp: ' + temperature.timestamp + '\n');
    };

    function onError() {
        alert('onError!');
    };

    var options = { frequency: 3000 };  // Update every 3 seconds

    var watchID = navigator.thermometer.watchTemperature(onSuccess, onError, options);

## navigator.thermometer.clearWatch

Stop watching the `Temperature` referenced by the `watchID` parameter.

    navigator.thermometer.clearWatch(watchID);

- __watchID__: The ID returned by `navigator.thermometer.watchTemperature`.

###  Example

    var watchID = navigator.thermometer.watchTemperature(onSuccess, onError, options);

    // ... later on ...

    navigator.thermometer.clearWatch(watchID);

## Temperature

Contains `Temperature` data captured at a specific point in time.

### Properties

- __val__:  Amount of temperature. _(Number)_
- __timestamp__: Creation timestamp in milliseconds. _(DOMTimeStamp)_
