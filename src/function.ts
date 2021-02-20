import { pipe } from 'fp-ts/function'
import { Ring } from 'fp-ts/Ring'
import { Field } from 'fp-ts/Field'
import { Ord } from 'fp-ts/Ord'

/**
 * @category model
 * @since 1.0.0
 */
type RingOperation = '+' | '-' | '*'

/**
 * @category model
 * @since 1.0.0
 */
interface RingInfix<A> {
  (left: A, operator: RingOperation, right: A): A
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getRingInfix = <A>({ add, sub, mul }: Ring<A>): RingInfix<A> => (left, operator, right) => {
  switch (operator) {
    case '+':
      return pipe(left, add(right))
    case '-':
      return pipe(left, sub(right))
    case '*':
      return pipe(left, mul(right))
  }
}

/**
 * @category model
 * @since 1.0.0
 */
type FieldOperation = '/' | 'mod' | RingOperation

/**
 * @category model
 * @since 1.0.0
 */
interface FieldInfix<A> {
  (left: A, operator: FieldOperation, right: A): A
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getFieldInfix = <A>(field: Field<A>): FieldInfix<A> => (left, operator, right) => {
  const { div, mod } = field
  const ringInfix = getRingInfix(field)
  switch (operator) {
    case '/':
      return pipe(left, div(right))
    case 'mod':
      return pipe(left, mod(right))
    default:
      return ringInfix(left, operator, right)
  }
}

/**
 * @category model
 * @since 1.0.0
 */
type OrdOperation = '==' | '<' | '<=' | '>' | '>='

/**
 * @category model
 * @since 1.0.0
 */
interface OrdInfix<A> {
  (left: A, operator: OrdOperation, right: A): boolean
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getOrdInfix = <A>({ equals, compare }: Ord<A>): OrdInfix<A> => (left, operator, right) => {
  switch (operator) {
    case '==':
      return pipe(left, equals(right))
    case '<':
      return pipe(left, compare(right)) === -1
    case '<=':
      return pipe(left, compare(right)) === -1 || pipe(left, equals(right))
    case '>':
      return pipe(left, compare(right)) === 1
    case '>=':
      return pipe(left, compare(right)) === 1 || pipe(left, equals(right))
  }
}
