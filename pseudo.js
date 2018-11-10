
'use strict';

// Math.pow(2, 32) === 4294967296
const TWO_TO_THIRTY_TWO = 4294967296;
const MAX_64_BIT_UINT = 0b1111111111111111111111111111111111111111111111111111111111111111n;

// check's if the passed value is a positive int:
function _isPositiveInt(value) {

    return typeof value === 'number' && 
            value >= 0 && 
            Math.floor(value) === value;

}

function _assertIsUnsigned64BitBigInt(value) {

    if (typeof value !== 'bigint') {
        throw new Error(`Expected BigInt, but got ${typeof value}`);
    }

    if (value < 0n) {
        throw new Error(`Value must be unsigned (i.e. non-negative).`);
    }

    if (value > MAX_64_BIT_UINT) {
        throw new Error(`Value mustn't overflow 64 bits (i.e. can't be bigger than ${MAX_64_BIT_UINT})`);
    }

}

// https://en.wikipedia.org/wiki/Linear_congruential_generator
class LinearCongruentialGenerator {

    constructor(seed) {

        if (!_isPositiveInt(seed) || seed === 0) {
            throw new Error('LinearCongruentialGenerator requires a non-zero positive integer as it\'s seed.');
        }
        
        this._state = seed % TWO_TO_THIRTY_TWO;

    }

    next() {

        // https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
        this._state = ((this._state * 134775813) + 1) % TWO_TO_THIRTY_TWO;
        return this._state / TWO_TO_THIRTY_TWO;

    }

}

// https://en.wikipedia.org/wiki/Xorshift
// http://www.jstatsoft.org/v08/i14/paper
class XorShift128 {

    constructor(seed) {

        if (seed instanceof Uint32Array && seed.length === 4) {
        
            const hasNonZeroElements = seed.some(function(value) { return value !== 0; });

            if (!hasNonZeroElements) {
                throw new Error('XorShift128 requires a Uint32Array with some non-zero elements as it\'s seed.');
            }

            // clone seed to form state
            this._state = Uint32Array.from(seed);

        } else if (_isPositiveInt(seed) && seed !== 0) {

            seed = seed % TWO_TO_THIRTY_TWO;

            // use a LCG to build the initial state from the seed:
            const lcg = new LinearCongruentialGenerator(seed);

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

    next() {

        let t = this._state[0];
        let w = this._state[3];

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

    }

}

// https://en.wikipedia.org/wiki/Xorshift#cite_note-vigna2-13
// https://v8.dev/blog/math-random
// https://stackoverflow.com/questions/34426499/what-is-the-real-definition-of-the-xorshift128-algorithm
class XorShift128Plus {

    constructor(seed1, seed2) {

        _assertIsUnsigned64BitBigInt(seed1);
        _assertIsUnsigned64BitBigInt(seed2);

        if (seed1 === 0n && seed2 === 0n) {
            throw new Error('Seed values can\'t both be zero.');
        }

        this._state = [ seed1, seed2 ];

    }

    next() {

        let x = this._state[0];
        const y = this._state[1];

        this._state[0] = y;
        // since BigInt are arbitrary precision, we need & MAX_64_BIT_UINT in 
        // order to throw away any bits above the lower 64:
        x ^= (x << 23n) & MAX_64_BIT_UINT;
        this._state[1] = x ^ y ^ (x >> 18n) ^ (y >> 5n);
            
        return (this._state[0] + this._state[1]) & MAX_64_BIT_UINT;

    }

}

module.exports = {
    LinearCongruentialGenerator,
    XorShift128,
    XorShift128Plus
};
