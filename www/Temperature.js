// Copyright (c) 2014, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

var Temperature = function(val, timestamp) {
    this.val = val;
    this.timestamp = timestamp || (new Date()).getTime();
};

module.exports = Temperature;
