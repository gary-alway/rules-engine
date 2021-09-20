import {
  testOutcomeAction,
  testProduct,
  testProductRule
} from '../../test/testFactories'
import { testRulesService } from '../../test/testRulesService'
import * as rulesService from '../service/rulesService'
import { executeRulesForProduct } from './rulesRunner'

const getRules = jest.fn()
jest
  .spyOn(rulesService, 'rulesServiceFactory')
  .mockImplementation(() => testRulesService({ getRules }))

const product = testProduct({ id: '1' })
const rule1 = testProductRule({ inclusions: { id: ['1'] } })
const rule2 = testProductRule({ inclusions: { id: ['2'] } })
const rule3 = testProductRule({ inclusions: { id: ['1'] } })
const rule4 = testProductRule({ inclusions: { id: ['3'] } })

describe('rules runner', () => {
  it('executes the rules for a product returning the outcomes', async () => {
    getRules.mockResolvedValueOnce([rule1, rule2, rule3, rule4])
    const outcome = await executeRulesForProduct(product)

    expect(outcome).toEqual({
      productId: '1',
      actions: [
        { ...rule1.action, active: true, ruleId: rule1.id },
        { ...rule3.action, active: true, ruleId: rule3.id }
      ]
    })
  })

  it('executes the rules for a product returning the outcomes and inactive outcomes from a previous execution', async () => {
    getRules.mockResolvedValueOnce([rule1, rule2, rule3, rule4])
    const previousAction1 = testOutcomeAction({ ruleId: rule1.id })
    const previousAction2 = testOutcomeAction({ ruleId: rule2.id })
    const previousAction4 = testOutcomeAction({ ruleId: rule4.id })
    const previousOutcomes = [previousAction1, previousAction2, previousAction4]

    const outcome = await executeRulesForProduct(product, previousOutcomes)

    expect(outcome).toEqual({
      productId: '1',
      actions: [
        { ...rule1.action, active: true, ruleId: rule1.id },
        { ...rule3.action, active: true, ruleId: rule3.id },
        { ...previousAction2, active: false, ruleId: rule2.id },
        { ...previousAction4, active: false, ruleId: rule4.id }
      ]
    })
  })
})
