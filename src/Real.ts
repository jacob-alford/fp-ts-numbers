import { Ord } from 'fp-ts/Ord'
import { Num } from './Num'

/**
 * @category model
 * @since 1.0.0
 */
export interface Real<A> extends Ord<A>, Num<A> {}
