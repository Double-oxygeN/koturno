/*
 * Copyright 2017 Double_oxygeN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Namespace for hashing.
 * @namespace
 */
export const SHA256 = (() => {
  const H = Uint32Array.from([
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
  ]);
  const K = Uint32Array.from([
    0x428a2f98,
    0x71374491,
    0xb5c0fbcf,
    0xe9b5dba5,
    0x3956c25b,
    0x59f111f1,
    0x923f82a4,
    0xab1c5ed5,
    0xd807aa98,
    0x12835b01,
    0x243185be,
    0x550c7dc3,
    0x72be5d74,
    0x80deb1fe,
    0x9bdc06a7,
    0xc19bf174,
    0xe49b69c1,
    0xefbe4786,
    0x0fc19dc6,
    0x240ca1cc,
    0x2de92c6f,
    0x4a7484aa,
    0x5cb0a9dc,
    0x76f988da,
    0x983e5152,
    0xa831c66d,
    0xb00327c8,
    0xbf597fc7,
    0xc6e00bf3,
    0xd5a79147,
    0x06ca6351,
    0x14292967,
    0x27b70a85,
    0x2e1b2138,
    0x4d2c6dfc,
    0x53380d13,
    0x650a7354,
    0x766a0abb,
    0x81c2c92e,
    0x92722c85,
    0xa2bfe8a1,
    0xa81a664b,
    0xc24b8b70,
    0xc76c51a3,
    0xd192e819,
    0xd6990624,
    0xf40e3585,
    0x106aa070,
    0x19a4c116,
    0x1e376c08,
    0x2748774c,
    0x34b0bcb5,
    0x391c0cb3,
    0x4ed8aa4a,
    0x5b9cca4f,
    0x682e6ff3,
    0x748f82ee,
    0x78a5636f,
    0x84c87814,
    0x8cc70208,
    0x90befffa,
    0xa4506ceb,
    0xbef9a3f7,
    0xc67178f2
  ]);
  const PLUS = (...args) => args.length ? args[0] + PLUS(...args.slice(1)) & 0xffffffff : 0;
  const CH = (x, y, z) => x & y ^ ~x & z;
  const MAJ = (x, y, z) => x & y ^ x & z ^ y & z;
  const SHR = (x, n) => x >>> n;
  const ROTR = (x, n) => x >>> n | x << 32 - n;
  const SIGMA0 = x => ROTR(x, 2) ^ ROTR(x, 13) ^ ROTR(x, 22);
  const SIGMA1 = x => ROTR(x, 6) ^ ROTR(x, 11) ^ ROTR(x, 25);
  const _SIGMA0 = x => ROTR(x, 7) ^ ROTR(x, 18) ^ SHR(x, 3);
  const _SIGMA1 = x => ROTR(x, 17) ^ ROTR(x, 19) ^ SHR(x, 10);
  return {
    parse: uint32Array => {
      const blocks = [];
      uint32Array.forEach((int, i) => {
        if (i % 16 === 0) blocks[i / 16 | 0] = new Uint32Array(16);
        blocks[Math.floor(i / 16)][i % 16] = int;
      });
      return blocks;
    },
    digest: uint32Array => {
      // TODO: impl.
      const hashes = Uint32Array.from(H);
      // parse buffer to some blocks
      const BLOCKS = SHA256.parse(uint32Array);
      BLOCKS.forEach(M => {
        const W = new Uint32Array(64);
        for (let t = 0; t < 64; ++t)
          W[t] = t < 16 ? M[t] : PLUS(_SIGMA1(W[t - 2]), W[t - 7], _SIGMA0(W[t - 15]), W[t - 16]);
        let [a, b, c, d, e, f, g, h] = hashes;
        for (let t = 0; t < 64; t++) {
          const T1 = PLUS(h, SIGMA1(e), CH(e, f, g), K[t], W[t]);
          const T2 = PLUS(SIGMA0(a), MAJ(a, b, c));
          h = g;
          g = f;
          f = e;
          e = PLUS(d, T1);
          d = c;
          c = b;
          b = a;
          a = PLUS(T1, T2);
        }
        hashes[0] = PLUS(hashes[0], a);
        hashes[1] = PLUS(hashes[1], b);
        hashes[2] = PLUS(hashes[2], c);
        hashes[3] = PLUS(hashes[3], d);
        hashes[4] = PLUS(hashes[4], e);
        hashes[5] = PLUS(hashes[5], f);
        hashes[6] = PLUS(hashes[6], g);
        hashes[7] = PLUS(hashes[7], h);
      });
      return hashes;
    }
  };
})();
