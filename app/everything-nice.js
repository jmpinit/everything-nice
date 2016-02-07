var ffi = require('ffi');
var path = require('path');

var lib = ffi.Library(path.join(__dirname, '../target/release/libeverything_nice'), {
    spice_init: [ 'void', [] ],
    add_one: [ 'int', ['int']],
    spiceit: [ 'void', ['string']  ],
});

console.log("trying to call lib...");
console.log("spice_init()", lib.spice_init());
console.log("add_one(1)", "=", lib.add_one(1));
console.log("spiceit", lib.spiceit("Hello!"));
console.log("done.");
