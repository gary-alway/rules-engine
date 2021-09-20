import { truthy } from './truthy'

describe('truthy', () => {
  it('filter an array', () => {
    expect(
      ['test', 1, -1, 0, null, undefined, 'true', 'false', false, true].filter(
        truthy
      )
    ).toEqual(['test', 1, -1, 'true', 'false', true])
  })

  test.each<
    [
      {
        test: string
      } | null,
      string | null
    ]
  >([
    [{ test: 'test 1' }, 'test 1'],
    [null, null]
  ])('single value [%s, %s]', (value, expected) => {
    const result = truthy(value) ? value.test : null
    expect(result).toEqual(expected)
  })
})
