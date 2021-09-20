import { getDynamoClient } from '../clients/getClients'
import { RulesService, rulesServiceFactory } from './rulesService'

const rulesService = rulesServiceFactory(getDynamoClient())

export const getRulesService = (): RulesService => rulesService
