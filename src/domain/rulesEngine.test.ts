import { Engine } from 'json-rules-engine'
import {
  testProduct,
  testProductRule,
  testRuleAction
} from '../../test/testFactories'
import { createProductRule } from './rulesEngine'

const id = 'test_rule_1334'
const engine = new Engine()
const action: RuleAction = testRuleAction({
  type: 'discount',
  value: 123
})

engine.addRule(
  createProductRule(
    testProductRule({
      id,
      inclusions: {
        id: ['1234', 'abcd'],
        name: ['include'],
        categories: ['books', 'films', 'TVs'],
        keywords: ['key', 'chave']
      },
      exclusions: {
        id: ['4321', 'dcba'],
        name: ['exclude'],
        categories: ['food', 'hardware'],
        keywords: ['foo', 'baa']
      },
      action
    })
  )
)

describe('rules engine', () => {
  it('A rule must contain at least 1 criterion', () => {
    expect(() =>
      createProductRule(
        testProductRule({
          name: 'invalid',
          inclusions: {},
          exclusions: {},
          action
        })
      )
    ).toThrowError('A rule must contain at least 1 criterion')
  })

  describe('inclusions only', () => {
    it('fires an event for a product that meets the id inclusions', async () => {
      const product = testProduct({
        id: '1234'
      })
      const { events } = await engine.run(product)

      expect(events).toHaveLength(1)
      expect(events[0].type).toBe(id)
      expect(events[0].params).toEqual(action)
    })

    it('fires an event for a product that meets the name inclusions', async () => {
      const product = testProduct({
        name: 'include'
      })
      const { events } = await engine.run(product)

      expect(events).toHaveLength(1)
      expect(events[0].type).toBe(id)
      expect(events[0].params).toEqual(action)
    })

    it('fires an event for a product that meets all the category inclusions', async () => {
      const product = testProduct({
        categories: ['books', 'films', 'music']
      })
      const { events } = await engine.run(product)

      expect(events).toHaveLength(1)
      expect(events[0].type).toBe(id)
      expect(events[0].params).toEqual(action)
    })

    it('fires an event for a product that meets some of the category inclusions', async () => {
      const product = testProduct({ categories: ['books', 'music'] })
      const { events } = await engine.run(product)

      expect(events).toHaveLength(1)
      expect(events[0].type).toBe(id)
      expect(events[0].params).toEqual(action)
    })

    it('fires an event for a product that meets a keyword inclusion', async () => {
      const product = testProduct({
        keywords: ['key']
      })
      const { events } = await engine.run(product)

      expect(events).toHaveLength(1)
      expect(events[0].type).toBe(id)
      expect(events[0].params).toEqual(action)
    })

    it('fires an event for a product that meets a keyword inclusion and a category inclusion', async () => {
      const product = testProduct({
        categories: ['books'],
        keywords: ['key']
      })
      const { events } = await engine.run(product)

      expect(events).toHaveLength(1)
      expect(events[0].type).toBe(id)
      expect(events[0].params).toEqual(action)
    })
  })

  describe('exclusions only', () => {
    it('fires no event for a product that breaks an id exclusion rule', async () => {
      const product = testProduct({ id: '4321', keywords: ['key'] })
      const { events } = await engine.run(product)
      expect(events).toHaveLength(0)
    })

    it('fires no event for a product that breaks a categories exclusion rule', async () => {
      const product = testProduct({ categories: ['books', 'films', 'food'] })
      const { events } = await engine.run(product)
      expect(events).toHaveLength(0)
    })

    it('fires no event for a product that breaks a keywords exclusion rule', async () => {
      const product = testProduct({
        id: '1234',
        keywords: ['foo', 'blah', 'test']
      })
      const { events } = await engine.run(product)
      expect(events).toHaveLength(0)
    })
  })

  describe('mixed inclusions / exclusions', () => {
    test.each([
      ['1234', 'name', ['books', 'films', 'food'], ['foo']],
      ['12', 'name', ['hardware'], []],
      ['12', 'name', ['hardware'], ['foo']],
      ['12', 'name', [], ['foo']],
      ['4321', 'name', [], ['key']],
      ['1234', 'exclude', [], ['key']]
    ])(
      'fires no event for a product that meets and breaks a rule',
      async (
        id: string,
        name: string,
        categories: string[],
        keywords: string[]
      ) => {
        const product = testProduct({
          id,
          name,
          categories,
          keywords
        })
        const { events } = await engine.run(product)
        expect(events).toHaveLength(0)
      }
    )
  })
})
