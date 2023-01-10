import Coffee from '../models/coffee'
import checkDisponibility from '../utils/coffee-helper'

describe('coffee disponibility', () => {
  test('when coffee has no stock it is not available', () => {
    const coffee = new Coffee({
      name: 'arabica',
      intensity: 12,
      price: 5,
      stock: 0
    })
    expect(checkDisponibility(coffee, 5)).toEqual(false)
  })
  test('when coffee has enough stock for the order quantity it is available', () => {
    const coffee = new Coffee({
      name: 'arabica',
      intensity: 12,
      price: 5,
      stock: 20
    })
    expect(checkDisponibility(coffee, 5)).toEqual(true)
  })
})
