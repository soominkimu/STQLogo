// Math definitions: Just for readability
// https://github.com/d3/d3-geo/blob/master/src/math.js

// consider degeneracy and robustness

export const τ    = Math.PI*2;
export const π    = Math.PI;
export const π_2  = Math.PI/2;
export const π_4  = Math.PI/4;
export const ε    = 1e-6;      // a small threshold value for the floating point computation
export const ε2   = 1e-12;

export const deg360 = 360;         // declare the special degree as the constant, name it.
export const deg180 = 180;
export const deg90  = 90;
export const degrees = deg180 / π;
export const radians = π / deg180;
export const π_2xdegrees = deg90;  // π/2 x degrees
export const abs   = Math.abs;
export const sin   = Math.sin;
export const cos   = Math.cos;
export const tan   = Math.tan;
export const sign  = Math.sign;
export const sqrt  = Math.sqrt;
export const pow   = Math.pow;
export const log   = Math.log;

export const min   = Math.min;
export const max   = Math.max;
export const round = Math.round;
export const trunc = Math.trunc;
export const floor = Math.floor;
export const random = Math.random;  // range [0, 1) never returns 1

export const randomInt   = max_1 => floor( random() * max_1 );  // range [0, max-1]
export const randomRange = (min, v, p) => vF( min + v * random(), p );
export const randomElement = arr => arr[floor( random()*arr.length )];

export const vF = (v, p=3) => Number.isInteger(v) ? v : parseFloat(v.toFixed(p));  // fixed digit number with precision=p

export const zero    = v => abs(v) < ε;        // is virtually zero?
export const epsilon = v => zero(v) ? 0 : v;   // reduce an infinitesimal number to zero

// to avoid NaN for the invalid domain ranges
export const asin = x => x > 1 ? π/2 : x < -1  ? -π/2 : Math.asin(x);
export const acos = x => x > 1 ? 0   : x < -1  ? π    : Math.acos(x);

// https://en.wikipedia.org/wiki/Haversine_formula
export const haversin = x => (x = sin(x/2))*x;
export const range = (x, r1, r2) => min(max(x, r1), r2);  // let r1 ≦ x ≦ r2

