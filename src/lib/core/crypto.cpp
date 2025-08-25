// RSA from scratch in pure C++ (single file, no external libs)
// ------------------------------------------------------------
// EDUCATIONAL ONLY — insecure:
//  - No OAEP/PSS padding
//  - Toy PRNG (xorshift32)
//  - Slow big-int ops (schoolbook, peasant mulmod)
//
// Build:  g++ -O2 -std=c++17 rsa_from_scratch.cpp -o rsa_demo
// Run:    ./rsa_demo
//
// This implements: BigInt (base 2^32), Miller–Rabin, xorshift32 RNG,
// keygen(e=65537), textbook RSA encrypt/decrypt over raw bytes (chunked).

#include <bits/stdc++.h>
using namespace std;

// ---------------- BigInt (unsigned) base 2^32, little-endian ----------------
struct Big
{
    vector<uint32_t> d; // least-significant limb first

    Big() {}
    Big(uint64_t x)
    {
        if (x)
        {
            d.push_back((uint32_t)x);
            uint32_t hi = (uint32_t)(x >> 32);
            if (hi)
                d.push_back(hi);
        }
    }

    bool isZero() const { return d.empty(); }

    void norm()
    {
        while (!d.empty() && d.back() == 0)
            d.pop_back();
    }

    static int cmp(const Big &a, const Big &b)
    {
        if (a.d.size() != b.d.size())
            return a.d.size() < b.d.size() ? -1 : 1;
        for (int i = (int)a.d.size() - 1; i >= 0; --i)
        {
            if (a.d[i] != b.d[i])
                return a.d[i] < b.d[i] ? -1 : 1;
        }
        return 0;
    }

    // a += b
    static void add(Big &a, const Big &b)
    {
        uint64_t carry = 0;
        size_t n = max(a.d.size(), b.d.size());
        if (a.d.size() < n)
            a.d.resize(n, 0);
        for (size_t i = 0; i < n; i++)
        {
            uint64_t ai = a.d[i];
            uint64_t bi = i < b.d.size() ? b.d[i] : 0;
            uint64_t s = ai + bi + carry;
            a.d[i] = (uint32_t)s;
            carry = s >> 32;
        }
        if (carry)
            a.d.push_back((uint32_t)carry);
    }

    // assume a >= b
    static void sub(Big &a, const Big &b)
    {
        int64_t carry = 0; // borrow as negative carry
        for (size_t i = 0; i < a.d.size(); i++)
        {
            int64_t ai = (int64_t)a.d[i];
            int64_t bi = i < b.d.size() ? (int64_t)b.d[i] : 0;
            int64_t s = ai - bi + carry;
            if (s < 0)
            {
                s += (1LL << 32);
                carry = -1;
            }
            else
                carry = 0;
            a.d[i] = (uint32_t)s;
        }
        a.norm();
    }

    static Big add(const Big &a, const Big &b)
    {
        Big r = a;
        add(r, b);
        return r;
    }

    static Big sub(const Big &a, const Big &b)
    {
        Big r = a;
        sub(r, b);
        return r;
    }

    static Big mul(const Big &a, const Big &b)
    {
        if (a.isZero() || b.isZero())
            return Big();
        Big r;
        r.d.assign(a.d.size() + b.d.size(), 0);
        for (size_t i = 0; i < a.d.size(); ++i)
        {
            uint64_t carry = 0;
            uint64_t ai = a.d[i];
            for (size_t j = 0; j < b.d.size(); ++j)
            {
                __uint128_t cur = (__uint128_t)r.d[i + j] + (__uint128_t)ai * b.d[j] + carry;
                r.d[i + j] = (uint32_t)cur;
                carry = (uint64_t)(cur >> 32);
            }
            size_t j = b.d.size();
            __uint128_t cur = (__uint128_t)r.d[i + j] + carry;
            r.d[i + j] = (uint32_t)cur;
            uint64_t c2 = (uint64_t)(cur >> 32);
            size_t k = i + j + 1;
            while (c2)
            {
                if (k >= r.d.size())
                    r.d.push_back(0);
                __uint128_t t = (__uint128_t)r.d[k] + c2;
                r.d[k] = (uint32_t)t;
                c2 = (uint64_t)(t >> 32);
                ++k;
            }
        }
        r.norm();
        return r;
    }

    // multiply by uint32
    static Big mulSmall(const Big &a, uint32_t m)
    {
        if (a.isZero() || m == 0)
            return Big();
        Big r;
        r.d.assign(a.d.size(), 0);
        uint64_t carry = 0;
        for (size_t i = 0; i < a.d.size(); ++i)
        {
            __uint128_t cur = (__uint128_t)a.d[i] * m + carry;
            r.d[i] = (uint32_t)cur;
            carry = (uint64_t)(cur >> 32);
        }
        if (carry)
            r.d.push_back((uint32_t)carry);
        return r;
    }

    // (q, rem) = a / m (m fits in 32 bits)
    static pair<Big, uint32_t> divmodSmall(const Big &a, uint32_t m)
    {
        if (m == 0)
            throw runtime_error("div by zero");
        Big q;
        q.d.assign(a.d.size(), 0);
        uint64_t rem = 0;
        for (int i = (int)a.d.size() - 1; i >= 0; --i)
        {
            __uint128_t cur = ((__uint128_t)rem << 32) + a.d[i];
            uint32_t qi = (uint32_t)(cur / m);
            rem = (uint64_t)(cur % m);
            q.d[i] = qi;
        }
        q.norm();
        return {q, (uint32_t)rem};
    }

    static Big fromBytes(const vector<uint8_t> &v)
    {
        Big r;
        size_t n = v.size();
        r.d.clear();
        r.d.reserve((n + 3) / 4);
        uint32_t limb = 0;
        int cnt = 0;
        for (int i = (int)n - 1; i >= 0; --i)
        {
            limb = (limb << 8) | v[i];
            if (++cnt == 4)
            {
                r.d.push_back(limb);
                limb = 0;
                cnt = 0;
            }
        }
        if (cnt)
        {
            limb <<= 8 * (4 - cnt);
            r.d.push_back(limb);
        }
        r.norm();
        return r;
    }

    vector<uint8_t> toBytes() const
    {
        vector<uint8_t> out;
        if (isZero())
            return out;
        out.resize(d.size() * 4);
        size_t k = 0;
        for (size_t i = 0; i < d.size(); ++i)
        {
            uint32_t limb = d[i];
            for (int j = 0; j < 4; ++j)
            {
                out[k++] = (uint8_t)(limb & 0xFF);
                limb >>= 8;
            }
        }
        // strip leading zeros
        while (out.size() > 0 && out.back() == 0)
            out.pop_back();
        reverse(out.begin(), out.end());
        return out;
    }

    bool isEven() const { return isZero() || ((d[0] & 1u) == 0); }

    static void shl1(Big &a)
    {
        uint32_t carry = 0;
        for (size_t i = 0; i < a.d.size(); ++i)
        {
            uint64_t cur = ((uint64_t)a.d[i] << 1) | carry;
            a.d[i] = (uint32_t)cur;
            carry = (uint32_t)(cur >> 32);
        }
        if (carry)
            a.d.push_back(carry);
    }
    static void shr1(Big &a)
    {
        uint32_t carry = 0;
        for (int i = (int)a.d.size() - 1; i >= 0; --i)
        {
            uint64_t cur = ((uint64_t)carry << 32) | a.d[i];
            a.d[i] = (uint32_t)(cur >> 1);
            carry = (uint32_t)(cur & 1u);
        }
        a.norm();
    }
};

// Comparison helpers
static inline bool operator<(const Big &a, const Big &b) { return Big::cmp(a, b) < 0; }
static inline bool operator>(const Big &a, const Big &b) { return Big::cmp(a, b) > 0; }
static inline bool operator==(const Big &a, const Big &b) { return Big::cmp(a, b) == 0; }
static inline bool operator!=(const Big &a, const Big &b) { return Big::cmp(a, b) != 0; }
static inline bool operator>=(const Big &a, const Big &b) { return Big::cmp(a, b) >= 0; }
static inline bool operator<=(const Big &a, const Big &b) { return Big::cmp(a, b) <= 0; }

// a %= m (by repeated subtraction; assumes a < 2*m typical in our uses)
static void modReduce(Big &a, const Big &m)
{
    if (a >= m)
    {
        Big::sub(a, m);
        if (a >= m)
            Big::sub(a, m);
    }
}

// (a + b) % m
static Big modAdd(const Big &a, const Big &b, const Big &m)
{
    Big r = Big::add(a, b);
    if (r >= m)
        Big::sub(r, m);
    return r;
}
// (a + a) % m
static Big modDouble(const Big &a, const Big &m)
{
    Big r = a;
    Big::add(r, a);
    if (r >= m)
        Big::sub(r, m);
    return r;
}

// mulmod via peasant/double-and-add to avoid Big division. O(n^2 * 32), slow but simple.
static Big mulmod(Big a, Big b, const Big &m)
{
    Big res(0);
    // Ensure a,b < m
    if (a >= m)
    {
        while (a >= m)
            Big::sub(a, m);
    }
    if (b >= m)
    {
        while (b >= m)
            Big::sub(b, m);
    }
    for (size_t i = 0; i < b.d.size(); ++i)
    {
        uint32_t limb = b.d[i];
        for (int bit = 0; bit < 32; ++bit)
        {
            if (limb & 1u)
            {
                res = modAdd(res, a, m);
            }
            limb >>= 1;
            a = modDouble(a, m);
            if (i == b.d.size() - 1 && limb == 0)
            {
                // fast path: remaining higher bits are zero for this limb
            }
        }
    }
    res.norm();
    return res;
}

static Big modPow(Big base, Big exp, const Big &mod)
{
    // base %= mod via subtraction loop (slow)
    while (base >= mod)
        Big::sub(base, mod);
    Big result(1);
    while (!exp.isZero())
    {
        if (!exp.isEven())
            result = mulmod(result, base, mod);
        exp = Big::divmodSmall(exp, 2).first; // shift right by 1 via small div
        base = mulmod(base, base, mod);
    }
    return result;
}

// a % small
static uint32_t modSmall(const Big &a, uint32_t m)
{
    uint64_t rem = 0;
    for (int i = (int)a.d.size() - 1; i >= 0; --i)
    {
        __uint128_t cur = ((__uint128_t)rem << 32) + a.d[i];
        rem = (uint64_t)(cur % m);
    }
    return (uint32_t)rem;
}

// xorshift32 PRNG (NOT secure)
struct XR
{
    uint32_t x;
    XR(uint32_t s)
    {
        if (!s)
            s = 0x9e3779b9u;
        x = s;
    }
    uint32_t next()
    {
        uint32_t y = x;
        y ^= y << 13;
        y ^= y >> 17;
        y ^= y << 5;
        x = y;
        return y;
    }
};

static Big randomBig(int bits, XR &rng)
{
    int limbs = (bits + 31) / 32;
    Big r;
    r.d.resize(limbs);
    for (int i = 0; i < limbs; i++)
        r.d[i] = rng.next();
    int top = bits - (limbs - 1) * 32;
    if (top < 32)
    {
        uint32_t mask = top == 32 ? 0xFFFFFFFFu : ((1u << top) - 1u);
        r.d.back() &= mask;
    }
    // ensure top bit set & odd
    if (top == 32)
        r.d.back() |= 0x80000000u;
    else
        r.d.back() |= (1u << (top - 1));
    if (r.d[0] % 2 == 0)
        r.d[0] |= 1u;
    r.norm();
    return r;
}

// Miller–Rabin
static const uint32_t SMALLP[] = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47};

static bool isProbablePrime(const Big &n, int rounds = 16)
{
    // handle small
    // if n < 2
    Big two(2), one(1);
    if (n.isZero())
        return false;
    if (n.d.size() == 1 && n.d[0] < 2)
        return false;
    for (uint32_t p : SMALLP)
    {
        if (n.d.size() == 1 && n.d[0] == p)
            return true;
        if (modSmall(n, p) == 0)
            return false;
    }
    // write n-1 = d * 2^s
    Big d = n;
    Big::sub(d, one);
    int s = 0;
    while (d.isEven())
    {
        d = Big::divmodSmall(d, 2).first;
        ++s;
    }
    XR rng((uint32_t)chrono::high_resolution_clock::now().time_since_epoch().count());
    for (int i = 0; i < rounds; i++)
    {
        // a in [2, n-2]
        Big a = randomBig(min(32 * (int)n.d.size(), 32 * 3), rng); // small random
        // force 2 <= a <= n-2
        if (a.isZero())
            a = Big(2);
        if (Big::cmp(a, two) < 0)
            a = two;
        Big n2 = n;
        Big::sub(n2, Big(2));
        while (a >= n2)
        { // reduce a to <= n-2
            Big::sub(a, n2);
            if (a.isZero())
                a = two;
        }
        Big x = modPow(a, d, n);
        if (x == one || Big::cmp(x, n2) == 0)
            continue;
        bool cont = false;
        for (int r = 1; r < s; r++)
        {
            x = mulmod(x, x, n);
            if (x == n2)
            {
                cont = true;
                break;
            }
        }
        if (cont)
            continue;
        return false;
    }
    return true;
}

static Big generatePrime(int bits)
{
    XR rng(0xA5A5A5A5u ^ (uint32_t)chrono::high_resolution_clock::now().time_since_epoch().count());
    while (true)
    {
        Big cand = randomBig(bits, rng);
        if (isProbablePrime(cand))
            return cand;
    }
}

// Compute d = e^{-1} mod phi using: choose k ≡ -phi^{-1} (mod e), then d=(k*phi+1)/e
static uint32_t invModSmall(uint32_t a, uint32_t m)
{ // inverse of a mod m (both small)
    int64_t t = 0, newt = 1;
    int64_t r = m, newr = a;
    while (newr != 0)
    {
        int64_t q = r / newr;
        int64_t tmp = t - q * newt;
        t = newt;
        newt = tmp;
        tmp = r - q * newr;
        r = newr;
        newr = tmp;
    }
    if (r != 1)
        throw runtime_error("no inverse");
    if (t < 0)
        t += m;
    return (uint32_t)t;
}

struct Key
{
    Big n;
    uint32_t e;
    Big d;
};

static Key generateKey(int bits = 512, uint32_t e = 65537u)
{
    if (bits < 256)
        throw runtime_error("Use >=256 bits for demo (still insecure).");
    Big p = generatePrime(bits / 2);
    Big q = generatePrime(bits - bits / 2);
    // ensure p!=q
    while (p == q)
        q = generatePrime(bits - bits / 2);
    Big n = Big::mul(p, q);
    // phi = (p-1)*(q-1)
    Big p1 = p;
    Big::sub(p1, Big(1));
    Big q1 = q;
    Big::sub(q1, Big(1));
    Big phi = Big::mul(p1, q1);
    // k ≡ -phi^{-1} (mod e)
    uint32_t r = modSmall(phi, e);
    uint32_t inv = invModSmall(r == 0 ? e : r, e); // if r==0 then phi % e == 0 -> but gcd must be 1, so won't happen
    uint32_t k = (e - (inv % e)) % e;
    // d = (k*phi + 1)/e
    Big kphi = Big::mulSmall(phi, k);
    // kphi += 1
    if (kphi.d.empty())
        kphi.d.push_back(1);
    else
    {
        uint64_t s = (uint64_t)kphi.d[0] + 1u;
        kphi.d[0] = (uint32_t)s;
        uint64_t c = s >> 32;
        size_t i = 1;
        while (c)
        {
            if (i >= kphi.d.size())
                kphi.d.push_back(0);
            uint64_t t = (uint64_t)kphi.d[i] + c;
            kphi.d[i] = (uint32_t)t;
            c = t >> 32;
            ++i;
        }
    }
    auto qr = Big::divmodSmall(kphi, e);
    if (qr.second != 0)
        throw runtime_error("inverse construction failed");
    Big d = qr.first;
    Key key{n, e, d};
    return key;
}

// -------- RSA raw block ops (NO PADDING) --------
static vector<uint8_t> bigintToFixedBytes(const Big &x, size_t k)
{
    vector<uint8_t> v = x.toBytes();
    if (v.size() > k)
        throw runtime_error("block too large");
    if (v.size() < k)
    {
        vector<uint8_t> pad(k - v.size(), 0);
        pad.insert(pad.end(), v.begin(), v.end());
        return pad;
    }
    return v;
}

static vector<uint8_t> encryptRaw(const vector<uint8_t> &msg, const Key &pub)
{
    // k = ceil(log2(n))/8
    size_t k = (pub.n.d.size() * 4); // rough upper bound; to avoid exact bit calc
    // ensure max message block < n; we use k-1 bytes per block
    size_t maxMsg = k - 1;
    vector<uint8_t> out;
    out.reserve(((msg.size() + maxMsg - 1) / maxMsg) * k);
    Big e(pub.e);
    for (size_t i = 0; i < msg.size(); i += maxMsg)
    {
        vector<uint8_t> block(msg.begin() + i, msg.begin() + min(msg.size(), i + maxMsg));
        Big m = Big::fromBytes(block);
        if (m >= pub.n)
            throw runtime_error("message block >= modulus");
        Big c = modPow(m, e, pub.n);
        vector<uint8_t> cb = bigintToFixedBytes(c, k);
        out.insert(out.end(), cb.begin(), cb.end());
    }
    return out;
}

extern "C" __declspec(dllexport) int encrypt(string file, string key)
{
}

extern "C" __declspec(dllexport) int decrypt(string file, string key)
{
}

static vector<uint8_t> decryptRaw(const vector<uint8_t> &ct, const Key &priv)
{
    size_t k = (priv.n.d.size() * 4);
    if (ct.size() % k != 0)
        throw runtime_error("invalid ciphertext length");
    vector<uint8_t> out;
    for (size_t i = 0; i < ct.size(); i += k)
    {
        vector<uint8_t> block(ct.begin() + i, ct.begin() + i + k);
        Big c = Big::fromBytes(block);
        Big m = modPow(c, priv.d, priv.n);
        vector<uint8_t> mb = m.toBytes();
        out.insert(out.end(), mb.begin(), mb.end());
    }
    return out;
}

// ---------------- Demo ----------------
int main()
{
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cout << "Generating key... (slow, educational)\n";
    Key key = generateKey(512, 65537u); // use 1024 for a slower demo
    // Show n bit length (approx)
    size_t bits = key.n.d.empty() ? 0 : ((key.n.d.size() - 1) * 32 + (32 - __builtin_clz(key.n.d.back())));
    cout << "n bits: " << bits << "\n";

    string msg = "Hello, RSA (pure C++) ðHello, RSA (pure C++) \xF0Hello, RSA (pure C++) \xF0\x9FHello, RSA (pure C++) \xF0\x9F\x91Hello, RSA (pure C++) \xF0\x9F\x91\x8B"; // UTF-8 string
    vector<uint8_t> m(msg.begin(), msg.end());

    auto ct = encryptRaw(m, key);
    cout << "Ciphertext hex (prefix): ";
    for (size_t i = 0; i < min<size_t>(ct.size(), 64); ++i)
    {
        static const char *hex = "0123456789abcdef";
        uint8_t b = ct[i];
        cout << hex[b >> 4] << hex[b & 0xF];
    }
    cout << (ct.size() > 64 ? "...\n" : "\n");

    auto pt = decryptRaw(ct, key);
    string rec(pt.begin(), pt.end());
    cout << "Recovered: " << rec << "\n";

    cout << "\nNOTE: This is textbook RSA — do not use for real security.\n";
    return 0;
}
