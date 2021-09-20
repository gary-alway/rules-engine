import { DynamoClient } from '../clients/dynamoClient'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const rulesServiceFactory = (client: DynamoClient) => {
  if (!client) {
    throw new Error('no dynamo client found')
  }

  const getRules = async (): Promise<ProductRule[]> => {
    return Promise.resolve([])
  }

  return {
    getRules
  }
}

export type RulesService = ReturnType<typeof rulesServiceFactory>
