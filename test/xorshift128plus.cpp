
// A reference implementation of XorShift128Plus used to produce values to test against.

#include <iostream>
#include <stdint.h>

uint64_t s[2] = {
        743057230457,
        4055030262322907474
    };

uint64_t next() {

    uint64_t x = s[0];
    const uint64_t y = s[1];

    s[0] = y;
    x ^= x << 23;
    s[1] = x ^ y ^ (x >> 18) ^ (y >> 5);

    return s[0] + s[1];
    
}


int main() {

    for (int i = 0; i < 250; i++) {
        std::cout << next() << "\n";
    }

}
