import * as E from 'fp-ts/Eq'
import * as S from 'fp-ts/Show'
import * as O from 'fp-ts/Ord'
import * as B from 'fp-ts/Bounded'
import { Ordering } from 'fp-ts/Ordering'
import { Semigroup } from 'fp-ts/Semigroup'
import { Monoid } from 'fp-ts/Monoid'
import { Show as ShowNumber, Eq as EqNumber, Ord as OrdNumber } from 'fp-ts/number'
import { constant, flow } from 'fp-ts/function'
import * as F from './Floating'

/**
 * @category model
 * @since 1.0.0
 */
export interface Float extends Float32Array {}

/**
 * Embeds a number in an FloatArray
 *
 * @example
 * import { cons } from 'fp-ts-numbers/Float'
 *
 * assert.deepStrictEqual(cons(0), new FloatArray([0]))
 *
 * @category constructors
 * @since 3.0.0
 */
export const of = (value: number): Float => new Float32Array([value])

/**
 * Retrieves the embedded value
 * @example
 * import { pipe } from 'fp-ts/lib/function';
 * import { fold, cons } from 'fp-ts-numbers/Float';
 *
 * assert.deepStrictEqual(pipe(cons(8), fold), 8);
 * @category destructors
 */
export const fold = (fa: Float): number => fa[0]

/**
 * Lift a function number -> number to Float -> Float
 *
 * @since 1.0.0
 */
export const map: (f: (n: number) => number) => (fa: Float) => Float = (f) => (fa) => of(f(fa[0]))

/**
 * Lift a function number -> Float to Float -> Float
 *
 * @since 1.0.0
 */
export const chain: (f: (n: number) => Float) => (fa: Float) => Float = (f) => (fa) => f(fa[0])

/**
 * Find the sign of a Float
 *
 * @since 1.0.0
 */
export const sign: (fa: Float) => Ordering = flow(fold, OrdNumber.compare(0))

/**
 * @category instances
 * @since 1.0.0
 */
export const Eq: E.Eq<Float> = {
  equals: (first) => (second) => EqNumber.equals(first[0])(second[0])
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Ord: O.Ord<Float> = {
  equals: Eq.equals,
  compare: (second) => (first) => OrdNumber.compare(second[0])(first[0])
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Bounded: B.Bounded<Float> = {
  equals: Eq.equals,
  compare: Ord.compare,
  top: of(-3.4e38),
  bottom: of(1.2e-38)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Floating: F.Floating<Float> = {
  add: (second) => (first) => of(fold(first) + fold(second)),
  zero: of(0),
  degree: constant(1),
  div: (second) => (first) => of(fold(first) / fold(second)),
  mod: (second) => (first) => of(fold(first) % fold(second)),
  mul: (second) => (first) => of(fold(first) * fold(second)),
  one: of(1),
  sub: (second) => (first) => of(fold(first) - fold(second)),
  equals: Eq.equals,
  compare: Ord.compare,
  abs: map(Math.abs)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Show: S.Show<Float> = {
  show: (a) => ShowNumber.show(a[0])
}

/**
 * `Float` semigroup under addition.
 *
 * @category instances
 * @since 1.0.0
 */
export const SemigroupSum: Semigroup<Float> = {
  concat: Floating.add
}

/**
 * `Float` semigroup under multiplication.
 *
 * @category instances
 * @since 3.0.0
 */
export const SemigroupProduct: Semigroup<Float> = {
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
export const MonoidSum: Monoid<Float> = {
  concat: SemigroupSum.concat,
  empty: of(0)
}

/**
 * `Float` monoid under multiplication.
 *
 * The `empty` value is `1`.
 *
 * @category instances
 * @since 3.0.0
 */
export const MonoidProduct: Monoid<Float> = {
  concat: SemigroupProduct.concat,
  empty: of(1)
}
