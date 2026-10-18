/**
 * Deterministic and unique test data generators.
 */

/**
 * Creates a seeded Linear Congruential Generator (LCG) pseudo-random number generator.
 * @param {number} [seed=42]
 * @returns {() => number} Returns float between 0 and 1
 */
export function createSeededRandom(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/**
 * Generates a unique test customer email with optional timestamp or seed.
 * @param {string} [prefix='test']
 * @returns {string}
 */
export function generateCustomerEmail(prefix = 'test') {
  const ts = Date.now().toString(36);
  const rand = Math.floor(Math.random() * 1000).toString(36);
  return `${prefix}-${ts}-${rand}@meridian.test`;
}

/**
 * Generates an order number string.
 * @param {string} [prefix='PF']
 * @param {number} [seed=42]
 * @returns {string}
 */
export function generateOrderNumber(prefix = 'PF', seed = 42) {
  const rng = createSeededRandom(seed);
  const num = Math.floor(rng() * 90000) + 10000;
  return `${prefix}-${num}`;
}

/**
 * Generates a valid test telephone number.
 * @returns {string}
 */
export function generatePhoneNumber() {
  return '+91 98200 ' + String(Math.floor(10000 + Math.random() * 90000));
}
