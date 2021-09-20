declare type CreatorType = 'brand' | 'author' | 'manufacturer'

declare type Product = {
  id: string
  name: string
  desc: string
  creatorId: string
  creatorType: CreatorType
  supplierId: string
  categories: string[]
  keywords: string[]
  metadata?: Record<string, string | string[] | number>
  price: number
}

declare type RuleType = 'increase' | 'discount' | 'link'
declare type LinkedProductAction =
  | 'buy-1-get-1-free'
  | 'buy-2-get-1-free'
  | 'half-price-discount'

declare type RuleAction = {
  type: RuleType
  value?: number
  linkedProductIds?: string[]
  linkAction?: LinkedProductAction
}

declare type Criteria = Partial<
  Record<
    keyof Omit<Product, 'price' | 'metadata' | 'desc' | 'creatorType'>,
    string[]
  >
>

declare type ProductRule = {
  id?: string
  name: string
  inclusions: Criteria
  exclusions: Criteria
  temporal?: {
    start: number
    end: number | 'onwards'
  }
  action: RuleAction
}

declare type OutcomeAction = RuleAction & {
  active: boolean
  ruleId: string
}

declare type Outcome = {
  productId: string
  actions: OutcomeAction[]
}
