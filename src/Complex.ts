import * as E from 'fp-ts/Eq'
import * as S from 'fp-ts/Show'
import * as O from 'fp-ts/Ord'
import * as B from 'fp-ts/Bounded'
import { negate } from 'fp-ts/Ring'
import { Semigroup } from 'fp-ts/Semigroup'
import { Monoid } from 'fp-ts/Monoid'
import { constant, pipe } from 'fp-ts/function'
import * as F from './Float'
import * as Fl from './Floating'
import { getFieldInfix } from './function'

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
export const of: (a: F.Float, b: F.Float) => Complex = (a, b) => ({
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
export const map: (fr: (a: F.Float) => F.Float, fc: (b: F.Float) => F.Float) => (c: Complex) => Complex = (fr, fc) => (
  c
) => of(fr(real(c)), fc(complex(c)))

/**
 * Lift a function number -> number to Float -> Float
 *
 * @since 1.0.0
 */
export const modulus: (c: Complex) => F.Float = ({ real: r, complex: c }) =>
  pipe(_(_(r, '*', r), '+', _(c, '*', c)), F.map(Math.sqrt))

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
  top: of(F.Bounded.top, F.Bounded.top),
  bottom: of(F.Bounded.bottom, F.Bounded.bottom)
}

const _ = getFieldInfix(F.Floating)

/**
 * @category instances
 * @since 1.0.0
 */
export const Floating: Fl.Floating<Complex> = {
  add: ({ real: c, complex: d }) => ({ real: a, complex: b }) => of(_(a, '+', c), _(b, '+', d)),
  zero: of(F.Floating.zero, F.Floating.zero),
  mul: ({ real: c, complex: d }) => ({ real: a, complex: b }) =>
    of(_(_(a, '*', c), '+', _(b, '*', d)), _(_(b, '*', c), '+', _(a, '*', d))),
  one: of(F.Floating.one, F.Floating.zero),
  sub: ({ real: c, complex: d }) => ({ real: a, complex: b }) => of(_(a, '-', c), _(b, '-', d)),
  degree: constant(1),
  div: ({ real: c, complex: d }) => ({ real: a, complex: b }) =>
    of(
      _(_(_(a, '*', c), '+', _(b, '*', d)), '/', _(_(c, '*', c), '+', _(d, '*', d))),
      _(_(_(b, '*', c), '-', _(a, '*', d)), '/', _(_(c, '*', c), '+', _(d, '*', d)))
    ),
  /* It's weird, but I'm following: https://www.tutorialspoint.com/How-does-modulus-work-with-complex-numbers-in-Python */
  mod: (y) => (x) =>
    pipe(
      Floating.div(x)(y),
      map(F.map(Math.floor), F.map(Math.floor)),
      Floating.mul(y),
      negate(Floating),
      Floating.add(x)
    ),
  equals: Eq.equals,
  compare: Ord.compare,
  abs: ({ real: r, complex: c }) => of(pipe(_(_(r, '*', r), '+', _(c, '*', c)), F.Floating.abs), F.Floating.zero)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Show: S.Show<Complex> = {
  show: ({ real: r, complex: c }) =>
    `${F.Show.show(r)}${F.sign(c) === -1 ? '-' : '+'}${pipe(c, F.Floating.abs, F.Show.show)}i`
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
