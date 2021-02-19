import * as assert from 'assert'
import { pipe } from 'fp-ts/function'
import * as _ from '../src/Int8'

describe('Int8', () => {
  it('Eq', () => {
    assert.deepStrictEqual(pipe(_.of(5), _.Eq.equals(_.of(5))), true)
  })

  it('Ord', () => {
    assert.deepStrictEqual(pipe(_.of(1), _.Ord.compare(_.of(2))), -1)
    assert.deepStrictEqual(pipe(_.of(2), _.Ord.compare(_.of(1))), 1)
    assert.deepStrictEqual(pipe(_.of(2), _.Ord.compare(_.of(2))), 0)
  })

  it('Field', () => {
    assert.deepStrictEqual(_.Field.degree(_.of(0)), 1)
    assert.deepStrictEqual(_.Field.degree(_.of(1)), 1)
    assert.deepStrictEqual(_.Field.degree(_.of(2)), 1)
    assert.deepStrictEqual(pipe(_.of(11), _.Field.sub(_.of(11))), _.Field.zero)
    assert.deepStrictEqual(pipe(_.of(11), _.Field.div(_.of(11))), _.Field.one)
    assert.deepStrictEqual(pipe(_.of(10), _.Field.mod(_.of(3))), _.of(1))
  })

  it('Show', () => {
    assert.deepStrictEqual(_.Show.show(_.of(1)), '1')
  })

  it('SemigroupSum', () => {
    assert.deepStrictEqual(pipe(_.of(2), _.SemigroupSum.concat(_.of(3))), _.of(5))
  })

  it('SemigroupProduct', () => {
    assert.deepStrictEqual(pipe(_.of(2), _.SemigroupProduct.concat(_.of(3))), _.of(6))
  })
})
