
'use strict';

// Math.pow(2, 32) === 4294967296
var TWO_TO_THIRTY_TWO = 4294967296;

// check's if the passed value is a positive int:
function _isPositiveInt(value) {

    return typeof value === 'number' && 
            value >= 0 && 
            Math.floor(value) === value;

}

// https://en.wikipedia.org/wiki/Linear_congruential_generator
function LinearCongruentialGenerator(seed) {

    if (!_isPositiveInt(seed) || seed === 0) {
        throw new Error('LinearCongruentialGenerator requires a non-zero positive integer as it\'s seed.');
    }
    
    this._state = seed % TWO_TO_THIRTY_TWO;

}

LinearCongruentialGenerator.prototype.next = function() {

    // https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
    this._state = ((this._state * 134775813) + 1) % TWO_TO_THIRTY_TWO;
    return this._state / TWO_TO_THIRTY_TWO;

};

// https://en.wikipedia.org/wiki/Xorshift
// http://www.jstatsoft.org/v08/i14/paper
function XorShift128(seed) {

    var lcg = null;
    var hasNonZeroElements = false;

    if (seed instanceof Uint32Array && seed.length === 4) {
    
        hasNonZeroElements = seed.some(function(value) { return value !== 0; });

        if (!hasNonZeroElements) {
            throw new Error('XorShift128 requires a Uint32Array with some non-zero elements as it\'s seed.');
        }

        // clone seed to form state
        this._state = Uint32Array.from(seed);

    } else if (_isPositiveInt(seed) && seed !== 0) {

        seed = seed % TWO_TO_THIRTY_TWO;

        // use a LCG to build the initial state from the seed:
        lcg = new LinearCongruentialGenerator(seed);

        this._state = new Uint32Array(4);

        // lcg.next() returns a number in [0, 1) so that lcg.next() * TWO_TO_THIRTY_TWO
        // is in the  interval [0, 2^32). When it is converted to a Uint32, it will be 
        // rounded down to an int.
        this._state[0] = lcg.next() * TWO_TO_THIRTY_TWO;
        this._state[1] = lcg.next() * TWO_TO_THIRTY_TWO;
        this._state[2] = lcg.next() * TWO_TO_THIRTY_TWO;
        this._state[3] = lcg.next() * TWO_TO_THIRTY_TWO;

    } else {

        throw new Error('XorShift128 requires a non-zero positive integer or a 4 element Uint32Array as it\'s seed.');

    }

}

XorShift128.prototype.next = function() {

    var t = this._state[0];
    var w = this._state[3];

    this._state[0] = this._state[1];
    this._state[1] = this._state[2];
    this._state[2] = this._state[3];

    // JS converts the arguments passed to bitwise operators as SIGNED 32 bit ints
    // so need to workaround that by using >>> and >>> 0:
    // http://stackoverflow.com/questions/6798111
    t = (t ^ (t << 11)) >>> 0;
    w = ((w ^ (w >>> 19)) ^ ( t ^ (t >>> 8))) >>> 0;

    this._state[3] = w;

    return w / TWO_TO_THIRTY_TWO;

};

module.exports = {
    LinearCongruentialGenerator: LinearCongruentialGenerator,
    XorShift128: XorShift128
};
