import { isEmpty } from 'ramda'

export const isValidRule = ({
  inclusions,
  exclusions
}: Partial<ProductRule>): boolean => !isEmpty({ ...inclusions, ...exclusions })
