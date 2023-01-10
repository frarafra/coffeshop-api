import Coffee from '../models/coffee'
import Order from '../models/order'

const initialCoffees = [
  {
    name: 'ristretto',
    intensity: 10,
    price: 3,
    stock: 20,
    _id: '603fade67c8d8742e9a575aa',
    __v: 0
  },
  {
    name: 'arabica',
    intensity: 12,
    price: 5,
    stock: 50,
    _id: '603faf0c7c8d8742e9a575ac',
    __v: 0
  }
]

const initialOrders = [
  {
    _id: '6040f813522fc63adb8458eb',
    amount: 50,
    quantity: 10,
    __v: 0
  },
  {
    _id: '6040f8f55b1bca3b6b980b1a',
    amount: 25,
    quantity: 5,
    __v: 0
  },
]

const coffeesInDb = async () => {
  const coffees = await Coffee.find({})
  return coffees.map(coffee => coffee.toJSON())
}

const ordersInDb = async () => {
  const orders = await Order.find({})
  return orders.map(order => order.toJSON())
}

export default {
  initialCoffees,
  initialOrders,
  coffeesInDb,
  ordersInDb,
}