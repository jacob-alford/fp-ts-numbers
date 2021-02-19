import * as E from 'fp-ts/Eq'
import * as S from 'fp-ts/Show'
import * as O from 'fp-ts/Ord'
import * as B from 'fp-ts/Bounded'
import { Semigroup } from 'fp-ts/Semigroup'
import { Monoid } from 'fp-ts/Monoid'
import { Show as ShowNumber, Eq as EqNumber, Ord as OrdNumber } from 'fp-ts/number'
import * as I from './Integral'

/**
 * @category model
 * @since 1.0.0
 */
export interface Int extends Int32Array {}

/**
 * Embeds a number in an IntArray
 *
 * @example
 * import { cons } from 'fp-ts-numbers/Int'
 *
 * assert.deepStrictEqual(cons(0), new IntArray([0]))
 *
 * @category constructors
 * @since 3.0.0
 */
export const of = (value: number): Int => new Int32Array([value])

/**
 * Retrieves the embedded value
 * @example
 * import { pipe } from 'fp-ts/lib/function';
 * import { fold, cons } from 'fp-ts-numbers/Int';
 *
 * assert.deepStrictEqual(pipe(cons(8), fold), 8);
 * @category destructors
 */
export const fold = (fa: Int): number => fa[0]

/**
 * Lift a function number -> number to Int -> Int
 *
 * @since 1.0.0
 */
export const map: (f: (n: number) => number) => (fa: Int) => Int = (f) => (fa) => of(f(fa[0]))

/**
 * Lift a function number -> Int to Int -> Int
 *
 * @since 1.0.0
 */
export const chain: (f: (n: number) => Int) => (fa: Int) => Int = (f) => (fa) => f(fa[0])

/**
 * @category instances
 * @since 1.0.0
 */
export const Eq: E.Eq<Int> = {
  equals: (first) => (second) => EqNumber.equals(first[0])(second[0])
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Ord: O.Ord<Int> = {
  equals: Eq.equals,
  compare: (second) => (first) => OrdNumber.compare(second[0])(first[0])
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Bounded: B.Bounded<Int> = {
  equals: Eq.equals,
  compare: Ord.compare,
  top: of(127),
  bottom: of(-128)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Integral: I.Integral<Int> = {
  add: (second) => (first) => of(fold(first) + fold(second)),
  zero: of(0),
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
export const Show: S.Show<Int> = {
  show: (a) => ShowNumber.show(a[0])
}

/**
 * `Int` semigroup under addition.
 *
 * @category instances
 * @since 1.0.0
 */
export const SemigroupSum: Semigroup<Int> = {
  concat: Integral.add
}

/**
 * `Int` semigroup under multiplication.
 *
 * @category instances
 * @since 3.0.0
 */
export const SemigroupProduct: Semigroup<Int> = {
  concat: Integral.mul
}

/**
 * `Int` monoid under addition.
 *
 * The `empty` value is `0`.
 *
 * @category instances
 * @since 3.0.0
 */
export const MonoidSum: Monoid<Int> = {
  concat: SemigroupSum.concat,
  empty: of(0)
}

/**
 * `Int` monoid under multiplication.
 *
 * The `empty` value is `1`.
 *
 * @category instances
 * @since 3.0.0
 */
export const MonoidProduct: Monoid<Int> = {
  concat: SemigroupProduct.concat,
  empty: of(1)
}
