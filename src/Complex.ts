import * as E from 'fp-ts/Eq'
import * as S from 'fp-ts/Show'
import * as O from 'fp-ts/Ord'
import * as B from 'fp-ts/Bounded'
import { Semigroup } from 'fp-ts/Semigroup'
import { Monoid } from 'fp-ts/Monoid'
import { constant } from 'fp-ts/function'
import * as F from './Float'
import * as Fl from './Floating'

const { add, mul, sub, div, one, zero } = F.Floating

/**
 * @category model
 * @since 1.0.0
 */
export interface Complex {
  _tag: 'Complex'
  real: F.Float
  complex: F.Float
}

/**
 * constructs a complex number
 *
 * @example
 * import { cons } from 'fp-ts-numbers/Float'
 *
 * assert.deepStrictEqual(cons(0), new FloatArray([0]))
 *
 * @category constructors
 * @since 3.0.0
 */
export const of: (a: F.Float) => (b: F.Float) => Complex = (a) => (b) => ({
  _tag: 'Complex',
  real: a,
  complex: b
})

/**
 * Retrieves the real-part of the complex number
 * @example
 * import { pipe } from 'fp-ts/lib/function';
 * import * as F from 'fp-ts-numbers/Float';
 * import { real, of } from 'fp-ts-numbers/Complex';
 *
 * assert.deepStrictEqual(pipe(of(1, 2), real), F.of(1));
 * @category destructors
 */
export const real: (c: Complex) => F.Float = (c) => c.real

/**
 * Retrieves the complex-part of the complex number
 * @example
 * import { pipe } from 'fp-ts/lib/function';
 * import * as F from 'fp-ts-numbers/Float';
 * import { complex, of } from 'fp-ts-numbers/Complex';
 *
 * assert.deepStrictEqual(pipe(of(1, 2), complex), F.of(2));
 * @category destructors
 */
export const complex: (c: Complex) => F.Float = (c) => c.complex

/**
 * Retrieves the embedded value
 * @example
 * import { pipe, tuple } from 'fp-ts/lib/function';
 * import { fold, of } from 'fp-ts-numbers/Complex';
 * import { Floating, of as float } from 'fp-ts-numbers/Float';
 *
 * assert.deepStrictEqual(pipe(of(8)(8), fold(Floating.add)), float(16));
 * @category destructors
 */
export const fold: <A>(f: (a: F.Float) => (b: F.Float) => A) => (c: Complex) => A = (f) => (c) => f(real(c))(complex(c))

/**
 * Lift a function number -> number to Float -> Float
 *
 * @since 1.0.0
 */
export const map: (fr: (a: F.Float) => F.Float) => (fc: (b: F.Float) => F.Float) => (c: Complex) => Complex = (fr) => (
  fc
) => (c) => of(fr(real(c)))(fc(complex(c)))

/**
 * Lift a function number -> number to Float -> Float
 *
 * @since 1.0.0
 */
export const modulus: (c: Complex) => F.Float = (c) =>
  F.map(Math.sqrt)(add(mul(real(c))(real(c)))(mul(complex(c))(complex(c))))

/**
 * @category instances
 * @since 1.0.0
 */
export const Eq: E.Eq<Complex> = {
  equals: (first) => (second) => F.Eq.equals(real(second))(real(first)) && F.Eq.equals(complex(second))(complex(second))
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Ord: O.Ord<Complex> = {
  equals: Eq.equals,
  compare: (first) => (second) => F.Ord.compare(modulus(second))(modulus(first))
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Bounded: B.Bounded<Complex> = {
  equals: Eq.equals,
  compare: Ord.compare,
  top: of(F.Bounded.top)(F.Bounded.top),
  bottom: of(F.Bounded.bottom)(F.Bounded.bottom)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Floating: Fl.Floating<Complex> = {
  add: (second) => (first) => of(add(real(second))(real(first)))(add(complex(second))(complex(first))),
  zero: of(zero)(zero),
  mul: (second) => (first) =>
    ((a, b, c, d) => of(add(mul(a)(c))(mul(b)(d)))(add(mul(b)(c))(mul(a)(d))))(
      real(first),
      complex(first),
      real(second),
      complex(second)
    ),
  one: of(one)(zero),
  sub: (second) => (first) => of(sub(real(second))(real(first)))(sub(complex(second))(complex(first))),
  degree: constant(1),
  div: (second) => (first) =>
    ((a, b, c, d) =>
      of(div(add(mul(c)(c))(mul(d)(d)))(add(mul(a)(c))(mul(b)(d))))(
        div(add(mul(c)(c))(mul(d)(d)))(sub(mul(b)(c))(mul(a)(d)))
      ))(real(first), complex(first), real(second), complex(second)),
  /* It's weird, but I'm following: https://www.tutorialspoint.com/How-does-modulus-work-with-complex-numbers-in-Python */
  mod: (second) => (first) =>
    Floating.sub(first)(Floating.mul(second)(map(F.map(Math.floor))(F.map(Math.floor))(Floating.div(first)(second)))),
  equals: Eq.equals,
  compare: Ord.compare,
  abs: (c) => of(F.map(Math.sqrt)(add(mul(real(c))(real(c)))(mul(complex(c))(complex(c)))))(zero)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Show: S.Show<Complex> = {
  show: (a) =>
    `${F.Show.show(real(a))}${F.sign(complex(a)) === -1 ? '-' : '+'}${F.Show.show(F.map(Math.abs)(complex(a)))}i`
}

/**
 * `Float` semigroup under addition.
 *
 * @category instances
 * @since 1.0.0
 */
export const SemigroupSum: Semigroup<Complex> = {
  concat: Floating.add
}

/**
 * `Float` semigroup under multiplication.
 *
 * @category instances
 * @since 3.0.0
 */
export const SemigroupProduct: Semigroup<Complex> = {
  concat: Floating.mul
}

/**
 * `Float` monoid under addition.
 *
 * The `empty` value is `0`.
 *
 * @category instances
 * @since 3.0.0
 */
export const MonoidSum: Monoid<Complex> = {
  concat: SemigroupSum.concat,
  empty: Floating.zero
}

/**
 * `Float` monoid under multiplication.
 *
 * The `empty` value is `1`.
 *
 * @category instances
 * @since 3.0.0
 */
export const MonoidProduct: Monoid<Complex> = {
  concat: SemigroupProduct.concat,
  empty: Floating.one
}
