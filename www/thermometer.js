// Copyright (c) 2014, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

/**
 * This class provides access to device thermometer data.
 * @constructor
 */
var argscheck = require('cordova/argscheck'),
    utils = require("cordova/utils"),
    exec = require("cordova/exec"),
    Acceleration = require('./Temperature');

// Is the thermometer sensor running?
var running = false;

// Keeps reference to watchTemperature calls.
var timers = {};

// Array of listeners; used to keep track of when we should call start and stop.
var listeners = [];

// Last returned temperature object from native
var temperature = null;

// Tells native to start.
function start() {
    exec(function(a) {
        var tempListeners = listeners.slice(0);
        temperature = new Temperature(a.val, a.timestamp);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].win(temperature);
        }
    }, function(e) {
        var tempListeners = listeners.slice(0);
        for (var i = 0, l = tempListeners.length; i < l; i++) {
            tempListeners[i].fail(e);
        }
    }, "Thermometer", "start", []);
    running = true;
}

// Tells native to stop.
function stop() {
    exec(null, null, "Thermometer", "stop", []);
    running = false;
}

// Adds a callback pair to the listeners array
function createCallbackPair(win, fail) {
    return {win:win, fail:fail};
}

// Removes a win/fail listener pair from the listeners array
function removeListeners(l) {
    var idx = listeners.indexOf(l);
    if (idx > -1) {
        listeners.splice(idx, 1);
        if (listeners.length === 0) {
            stop();
        }
    }
}

var thermometer = {
    /**
     * Asynchronously acquires the current temperature.
     *
     * @param {Function} successCallback    The function to call when the temperature data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the temperature data. (OPTIONAL)
     * @param {ThermometerOptions} options    The options for getting the thermometer data such as frequency. (OPTIONAL)
     */
    getCurrentTemperature: function(successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'thermometer.getCurrentTemperature', arguments);

        var p;
        var win = function(a) {
            removeListeners(p);
            successCallback(a);
        };
        var fail = function(e) {
            removeListeners(p);
            errorCallback && errorCallback(e);
        };

        p = createCallbackPair(win, fail);
        listeners.push(p);

        if (!running) {
            start();
        }
    },

    /**
     * Asynchronously acquires the temperature repeatedly at a given interval.
     *
     * @param {Function} successCallback    The function to call each time the temperature data is available
     * @param {Function} errorCallback      The function to call when there is an error getting the temperature data. (OPTIONAL)
     * @param {ThermometerOptions} options    The options for getting the thermometer data such as frequency. (OPTIONAL)
     * @return String                       The watch id that must be passed to #clearWatch to stop watching.
     */
    watchTemperature: function(successCallback, errorCallback, options) {
        argscheck.checkArgs('fFO', 'thermometer.watchTemperature', arguments);
        // Default interval (10 sec)
        var frequency = (options && options.frequency && typeof options.frequency == 'number') ? options.frequency : 10000;

        // Keep reference to watch id, and report temperature readings as often as defined in frequency
        var id = utils.createUUID();

        var p = createCallbackPair(function(){}, function(e) {
            removeListeners(p);
            errorCallback && errorCallback(e);
        });
        listeners.push(p);

        timers[id] = {
            timer:window.setInterval(function() {
                if (temperature) {
                    successCallback(temperature);
                }
            }, frequency),
            listeners:p
        };

        if (running) {
            // If we're already running then immediately invoke the success callback
            // but only if we have retrieved a value, sample code does not check for null ...
            if (temperature) {
                successCallback(temperature);
            }
        } else {
            start();
        }

        return id;
    },

    /**
     * Clears the specified thermometer watch.
     *
     * @param {String} id       The id of the watch returned from #watchTemperature.
     */
    clearWatch: function(id) {
        // Stop javascript timer & remove from timer list
        if (id && timers[id]) {
            window.clearInterval(timers[id].timer);
            removeListeners(timers[id].listeners);
            delete timers[id];
        }
    }
};
module.exports = thermometer;
