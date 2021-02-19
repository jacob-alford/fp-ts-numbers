import { Field } from 'fp-ts/Field'
import { Real } from './Real'

/**
 * @category model
 * @since 1.0.0
 */
export interface Floating<A> extends Field<A>, Real<A> {}
