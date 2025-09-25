// RSA from scratch (NO libraries, NOT secure). For learning only.

// ---------- Math utils ----------
const ONE = 1n,
  ZERO = 0n;

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

function egcd(a, b) {
  let [old_r, r] = [a, b];
  let [old_s, s] = [1n, 0n];
  let [old_t, t] = [0n, 1n];
  while (r !== 0n) {
    const q = old_r / r;
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
    [old_t, t] = [t, old_t - q * t];
  }
  return { g: old_r, x: old_s, y: old_t };
}

function modInv(a, m) {
  const { g, x } = egcd(((a % m) + m) % m, m);
  if (g !== 1n) throw new Error("No modular inverse");
  return ((x % m) + m) % m;
}

function modPow(base, exp, mod) {
  base %= mod;
  let res = 1n;
  while (exp > 0n) {
    if (exp & 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return res;
}

function bitLength(n) {
  let bits = 0;
  while (n >> BigInt(bits)) bits++;
  return bits;
}

// ---------- Toy PRNG (NOT secure) ----------
function xorshift32(seed) {
  let x = seed >>> 0 || 0x9e3779b9;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x >>>= 0;
    x ^= x << 5;
    x >>>= 0;
    return x >>> 0;
  };
}
function randomBigInt(bits, rnd = xorshift32(Date.now() ^ (performance?.now?.() | 0))) {
  let out = 0n;
  let produced = 0;
  while (produced < bits) {
    const r = BigInt(rnd());
    out = (out << 32n) | r;
    produced += 32;
  }
  // trim to bits and set top/bottom bits to ensure size and oddness
  const extra = produced - bits;
  if (extra > 0) out >>= BigInt(extra);
  out |= 1n; // odd
  out |= 1n << BigInt(bits - 1); // ensure top bit set
  return out;
}

// ---------- Miller–Rabin primality (probabilistic) ----------
const SMALL_PRIMES = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n];

function isProbablePrime(n, rounds = 16) {
  if (n < 2n) return false;
  for (const p of SMALL_PRIMES) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }
  // write n-1 = d * 2^s
  let d = n - 1n,
    s = 0n;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s++;
  }

  const rnd = xorshift32(Number(n % 0xffffffffn) ^ Date.now());
  for (let i = 0; i < rounds; i++) {
    // pick a in [2, n-2]
    let a = 2n + (BigInt(rnd()) % (n - 3n));
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    let cont = false;
    for (let r = 1n; r < s; r++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        cont = true;
        break;
      }
    }
    if (cont) continue;
    return false;
  }
  return true;
}

function generatePrime(bits) {
  while (true) {
    const cand = randomBigInt(bits);
    if (isProbablePrime(cand)) return cand;
  }
}

// ---------- Key generation ----------
function generateRSAKeyPair(bits = 1024, e = 65537n) {
  if (bits < 512) throw new Error("Use >= 512 for demos; still insecure without padding/CSPRNG.");
  const half = Math.floor(bits / 2);
  let p, q, n, phi;
  while (true) {
    p = generatePrime(half);
    q = generatePrime(bits - half);
    if (p === q) continue;
    n = p * q;
    phi = (p - 1n) * (q - 1n);
    if (gcd(e, phi) === 1n) break;
  }
  const d = modInv(e, phi);
  return { publicKey: { e, n }, privateKey: { d, n }, p, q };
}

// ---------- Encoding helpers ----------
const te = new TextEncoder();
const td = new TextDecoder();

function bytesToBigInt(bytes) {
  let x = 0n;
  for (const b of bytes) x = (x << 8n) | BigInt(b);
  return x;
}
function bigIntToBytes(x, len) {
  const out = new Uint8Array(len);
  for (let i = len - 1; i >= 0; i--) {
    out[i] = Number(x & 0xffn);
    x >>= 8n;
  }
  return out;
}
function chunkBytes(u8, size) {
  const chunks = [];
  for (let i = 0; i < u8.length; i += size)
    chunks.push(u8.subarray(i, Math.min(i + size, u8.length)));
  return chunks;
}

// ---------- Raw textbook RSA (no padding; DO NOT use for real data) ----------
function rsaEncryptBytes(plainBytes, { e, n }) {
  const k = Math.ceil(bitLength(n) / 8); // modulus size in bytes
  const maxMsg = k - 1; // ensure m < n (no padding)
  const blocks = chunkBytes(plainBytes, maxMsg);
  const out = [];
  for (const block of blocks) {
    const m = bytesToBigInt(block);
    if (m >= n) throw new Error("Block too large");
    const c = modPow(m, e, n);
    out.push(bigIntToBytes(c, k)); // fixed-size blocks
  }
  return Uint8Array.from(out.flat());
}

function rsaDecryptBytes(cipherBytes, { d, n }) {
  const k = Math.ceil(bitLength(n) / 8);
  if (cipherBytes.length % k !== 0) throw new Error("Invalid ciphertext length");
  const out = [];
  for (let i = 0; i < cipherBytes.length; i += k) {
    const block = cipherBytes.subarray(i, i + k);
    const c = bytesToBigInt(block);
    const m = modPow(c, d, n);
    // strip leading zeros by auto-sizing to minimal bytes
    const mLen = Math.max(1, Math.ceil(bitLength(m) / 8));
    out.push(bigIntToBytes(m, mLen));
  }
  return Uint8Array.from(out.flat());
}

console.log("start");
// ---------- Demo ----------
(function demo() {
  const { publicKey, privateKey } = generateRSAKeyPair(1024); // change to 2048 for slower demo

  console.log(publicKey);
  console.log(privateKey);
  const message = "Hello, RSA (from scratch) 👋";
  const plaintext = te.encode(message);

  const ciphertext = rsaEncryptBytes(plaintext, publicKey);
  console.log(ciphertext);
  const recovered = rsaDecryptBytes(ciphertext, privateKey);

  console.log("Public n bits:", bitLength(publicKey.n));
  console.log("Ciphertext (hex):", Buffer.from(ciphertext).toString("hex").slice(0, 128) + "...");
  console.log("Recovered:", td.decode(recovered));
})();
