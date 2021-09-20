// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const rulesServiceFactory = () => {
  const getRules = async (): Promise<ProductRule[]> => {
    return Promise.resolve([])
  }

  return {
    getRules
  }
}

export type RulesService = ReturnType<typeof rulesServiceFactory>
