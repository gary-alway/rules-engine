import { Rule, RuleProperties } from 'json-rules-engine'
import { isValidRule } from './ruleValidation'

interface Condition {
  fact: string
  operator: string
  value: string | string[]
}

const createConditionPermutations = (
  inclusions: Condition[],
  exclusions: Condition[]
): Condition[] => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return inclusions.reduce((acc: any[], curr) => {
    return [...acc, { all: [curr, ...exclusions] }]
  }, [])
}

const createArrayToStringRules = (
  inclusions: string[] = [],
  exclusions: string[] = [],
  fact: string
) => {
  const ruleExclusions: Condition[] = exclusions.map(value => ({
    fact,
    operator: 'notEqual',
    value
  }))

  const ruleInclusions: Condition[] = [
    {
      fact,
      operator: 'in',
      value: inclusions
    }
  ]

  return { ruleInclusions, ruleExclusions }
}

const createArrayToArrayRules = (
  inclusions: string[] = [],
  exclusions: string[] = [],
  fact: string
) => {
  const ruleExclusions: Condition[] = exclusions.map(value => ({
    fact,
    operator: 'doesNotContain',
    value
  }))

  const ruleInclusions: Condition[] = inclusions.map(value => ({
    fact,
    operator: 'contains',
    value
  }))

  return { ruleInclusions, ruleExclusions }
}

export const createProductRule = ({
  id,
  inclusions,
  exclusions,
  action
}: ProductRule): RuleProperties => {
  if (!isValidRule({ inclusions, exclusions })) {
    throw new Error('A rule must contain at least 1 criterion')
  }

  const idConditions = createArrayToStringRules(
    inclusions.id,
    exclusions.id,
    'id'
  )

  const nameConditions = createArrayToStringRules(
    inclusions.name,
    exclusions.name,
    'name'
  )

  const creatorIdConditions = createArrayToStringRules(
    inclusions.creatorId,
    exclusions.creatorId,
    'creatorId'
  )

  const supplierIdConditions = createArrayToStringRules(
    inclusions.supplierId,
    exclusions.supplierId,
    'supplierId'
  )

  const categoryConditions = createArrayToArrayRules(
    inclusions.categories,
    exclusions.categories,
    'categories'
  )

  const keywordConditions = createArrayToArrayRules(
    inclusions.keywords,
    exclusions.keywords,
    'keywords'
  )

  const any = createConditionPermutations(
    [
      ...idConditions.ruleInclusions,
      ...nameConditions.ruleInclusions,
      ...creatorIdConditions.ruleInclusions,
      ...supplierIdConditions.ruleInclusions,
      ...categoryConditions.ruleInclusions,
      ...keywordConditions.ruleInclusions
    ],
    [
      ...idConditions.ruleExclusions,
      ...nameConditions.ruleExclusions,
      ...creatorIdConditions.ruleExclusions,
      ...supplierIdConditions.ruleExclusions,
      ...categoryConditions.ruleExclusions,
      ...keywordConditions.ruleExclusions
    ]
  )

  return new Rule({
    conditions: { any },
    event: {
      type: id!,
      params: action
    }
  })
}
