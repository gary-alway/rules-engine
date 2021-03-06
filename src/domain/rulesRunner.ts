import { Engine } from 'json-rules-engine'
import { truthy } from '../utils/truthy'
import { createProductRule } from './rulesEngine'

export const executeRulesForProduct = async (
  product: Product,
  productRules: ProductRule[],
  previousActions?: OutcomeAction[]
): Promise<Outcome> => {
  const engine = new Engine()

  const rules = productRules.map(createProductRule)

  rules.forEach(rule => engine.addRule(rule))

  const { events } = await engine.run(product)

  const actions: OutcomeAction[] = events
    .map(
      ({ type, params }) =>
        ({ ruleId: type, active: true, ...params } as OutcomeAction)
    )
    .filter(truthy)

  const ruleIds = actions.map(({ ruleId }) => ruleId)

  const inactive = (previousActions || [])
    .filter(({ ruleId }) => !ruleIds.includes(ruleId))
    .map(action => ({ ...action, active: false }))

  return {
    productId: product.id,
    actions: [...actions, ...inactive]
  }
}
