import * as E from 'fp-ts/Eq'
import * as S from 'fp-ts/Show'
import * as O from 'fp-ts/Ord'
import * as B from 'fp-ts/Bounded'
import * as F from 'fp-ts/Field'
import { Semigroup } from 'fp-ts/Semigroup'
import { Monoid } from 'fp-ts/Monoid'
import { Show as ShowNumber } from 'fp-ts/number'

/**
 * @category model
 * @since 1.0.0
 */
export interface Int8 extends Int8Array {}

/**
 * Embeds a number in an Int8Array
 *
 * @example
 * import { cons } from 'fp-ts-numbers/Int8'
 *
 * assert.deepStrictEqual(cons(0), new Int8Array([0]))
 *
 * @category constructors
 * @since 3.0.0
 */
export const of = (value: number): Int8 => new Int8Array([value])

/**
 * Retrieves the embedded value
 * @example
 * import { pipe } from 'fp-ts/lib/function';
 * import { fold, cons } from 'fp-ts-numbers/Int8';
 *
 * assert.deepStrictEqual(pipe(cons(8), fold), 8);
 * @category destructors
 */
export const fold = (fa: Int8): number => fa[0]

/**
 * @category instances
 * @since 1.0.0
 */
export const Eq: E.Eq<Int8> = {
  equals: (first) => (second) => fold(first) === fold(second)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Ord: O.Ord<Int8> = {
  equals: Eq.equals,
  compare: (second) => (first) => (fold(first) < fold(second) ? -1 : fold(first) > fold(second) ? 1 : 0)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Bounded: B.Bounded<Int8> = {
  equals: Eq.equals,
  compare: Ord.compare,
  top: of(127),
  bottom: of(-128)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Field: F.Field<Int8> = {
  add: (second) => (first) => of(fold(second) + fold(first)),
  zero: of(0),
  mul: (second) => (first) => of(fold(second) * fold(first)),
  one: of(1),
  sub: (second) => (first) => of(fold(second) - fold(first)),
  degree: () => 1,
  div: (second) => (first) => of(fold(first) / fold(second)),
  mod: (second) => (first) => of(fold(first) % fold(second))
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Show: S.Show<Int8> = {
  show: (a) => ShowNumber.show(a[0])
}

/**
 * `Int8` semigroup under addition.
 *
 * @category instances
 * @since 1.0.0
 */
export const SemigroupSum: Semigroup<Int8> = {
  concat: Field.add
}

/**
 * `Int8` semigroup under multiplication.
 *
 * @category instances
 * @since 3.0.0
 */
export const SemigroupProduct: Semigroup<Int8> = {
  concat: Field.mul
}

/**
 * `Int8` monoid under addition.
 *
 * The `empty` value is `0`.
 *
 * @category instances
 * @since 3.0.0
 */
export const MonoidSum: Monoid<Int8> = {
  concat: SemigroupSum.concat,
  empty: of(0)
}

/**
 * `Int8` monoid under multiplication.
 *
 * The `empty` value is `1`.
 *
 * @category instances
 * @since 3.0.0
 */
export const MonoidProduct: Monoid<Int8> = {
  concat: SemigroupProduct.concat,
  empty: of(1)
}
