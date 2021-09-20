import { testProductRule } from '../../test/testFactories'
import { isValidRule } from './ruleValidation'

describe('rule validation', () => {
  it('passes validation', () => {
    const rule = testProductRule()
    expect(isValidRule(rule)).toBe(true)
  })

  it('fails validation if there are no rule criteria', () => {
    expect(isValidRule({ inclusions: {}, exclusions: {} })).toBe(false)
  })
})
