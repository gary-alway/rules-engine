import { datatype, lorem } from 'faker'
import { creatorTypes, ruleTypes } from '../src/types'

export const testCreatorType = (): CreatorType =>
  creatorTypes[Math.floor(Math.random() * creatorTypes.length)]

export const testProduct = (overrides: Partial<Product> = {}): Product => ({
  id: datatype.uuid(),
  name: lorem.words(3),
  desc: lorem.words(20),
  creatorId: datatype.uuid(),
  creatorType: testCreatorType(),
  supplierId: datatype.uuid(),
  categories: [],
  keywords: [],
  price: datatype.number(),
  ...overrides
})

export const testRuleType = (): RuleType =>
  ruleTypes[Math.floor(Math.random() * ruleTypes.length)]

export const testRuleAction = (
  overrides: Partial<RuleAction> = {}
): RuleAction => ({
  type: testRuleType(),
  ...overrides
})

export const testProductRule = (
  overrides: Partial<ProductRule> = {}
): ProductRule => ({
  id: datatype.uuid(),
  name: lorem.words(2),
  inclusions: {
    id: [datatype.uuid()],
    name: [lorem.word()]
  },
  exclusions: {
    categories: lorem.words(10).split(' ')
  },
  action: testRuleAction(),
  ...overrides
})

export const testOutcomeAction = (
  overrides: Partial<OutcomeAction> = {}
): OutcomeAction => ({
  ...testRuleAction(),
  active: true,
  ruleId: datatype.uuid(),
  ...overrides
})

export const testOutcome = (overrides: Partial<Outcome> = {}): Outcome => ({
  productId: datatype.uuid(),
  actions: [testOutcomeAction()],
  ...overrides
})
