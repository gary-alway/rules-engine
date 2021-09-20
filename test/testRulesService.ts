import { RulesService } from '../src/service/rulesService'

export const testRulesService = ({
  getRules = jest.fn()
}: RulesService): RulesService => ({
  getRules
})
