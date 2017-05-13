
// A reference implementation of XorShift128 used to produce values to test against.
// This is based on a C implementation given in the original paper
// (http://www.jstatsoft.org/v08/i14/paper) as:
//
// unsigned long xor128() {
//   static unsigned long x = 123456789, y = 362436069, z = 521288629, w = 88675123;
//   unsigned long t = (x ^ (x << 11));
//   x = y; y = z; z = w;
//   return (w = (w ^ (w >> 19)) ^ (t ^ (t >> 8)));
// }

#include <iostream>
#include <stdint.h>

using namespace std;

uint32_t x = 123456789, y = 362436069, z = 521288629, w = 88675123;

uint32_t xor128() {

    uint32_t t = (x ^ (x << 11));

    x = y; y = z; z = w;

    w = ((w ^ (w >> 19)) ^ (t ^ (t >> 8)));

    return w;

}

int main() {

    for (int i = 0; i < 250; i++) {

        cout << xor128();
        cout << "\n";

    }

}
