import * as R from 'fp-ts/Ring'
import * as Eq from 'fp-ts/Eq'
import { Endomorphism } from 'fp-ts/function'

/**
 * @category model
 * @since 1.0.0
 */
export interface Num<A> extends R.Ring<A>, Eq.Eq<A> {
  abs: Endomorphism<A>
}
