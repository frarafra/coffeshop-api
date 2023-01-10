import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import Coffee from '../models/coffee'
import User from '../models/user'
import Order from '../models/order'
import helper from './test_helper'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const api = supertest(app)

beforeEach(async () => {
  await Coffee.deleteMany({})
  await User.deleteMany({})
  await Order.deleteMany({})

  let orderObject = new Order(helper.initialOrders[0])
  await orderObject.save()
})

describe('when there is initially some orders saved', () => {
  let token: string
  beforeEach(async () => {
    const saltRounds = 10
    const password = 'B.L.U.E.D.E.M.O.N.R.O.C.K.S.'
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username: 'bdemon',
      passwordHash,
      role: 'admin'
    })
    const savedUser = await user.save()
    const userForToken = {
      username: savedUser.username,
      role: savedUser.role,
      id: savedUser._id,
    }
    token = jwt.sign(userForToken, process.env.SECRET as jwt.Secret)
  })
  test('orders are returned as json', async () => {
    await api
      .get('/api/orders')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all orders are returned', async () => {
    const response = await api.get('/api/orders')
      .set('Authorization', `bearer ${token}`)
    expect(response.body.length).toBe(1)
  })
})

describe('addition of a new order', () => {
  test('succeeds with valid data', async () => {
    const saltRounds = 10
    const password = '12345'
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username: 'pere',
      passwordHash,
      role: 'customer'
    })
    const savedUser = await user.save()
    const coffee = new Coffee({
      name: 'ristretto',
      intensity: 10,
      price: 3,
      stock: 20
    })
    const savedCoffee = await coffee.save()
    const newOrder = {
      quantity: 5,
      coffee: savedCoffee.name
    }
    const userForToken = {
      username: savedUser.username,
      role: savedUser.role,
      id: savedUser._id,
    }
    const token = jwt.sign(userForToken, process.env.SECRET as jwt.Secret)
    await api
      .post('/api/orders')
      .set('Authorization', `bearer ${token}`)
      .send(newOrder)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const ordersAtEnd = await helper.ordersInDb()
    expect(ordersAtEnd.length).toBe(2)

    const quantity = ordersAtEnd.map(order => order.quantity)
    expect(quantity).toContain(newOrder.quantity)
  })
})

afterAll(() => {
  mongoose.connection.close()
})