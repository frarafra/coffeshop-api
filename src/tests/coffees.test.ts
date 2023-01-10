import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app'
import Coffee from '../models/coffee'
import User from '../models/user'
import helper from './test_helper'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const api = supertest(app)

beforeEach(async () => {
  await Coffee.deleteMany({})
  await User.deleteMany({})

  let coffeeObject = new Coffee(helper.initialCoffees[0])
  await coffeeObject.save()
})

describe('when there is initially some coffees saved', () => {
  test('coffees are returned as json', async () => {
    await api
      .get('/api/coffees')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all coffees are returned', async () => {
    const response = await api.get('/api/coffees')
    expect(response.body.length).toBe(1)
  })
})

describe('addition of a new coffee', () => {
  test('succeeds with valid data', async () => {
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
    const token = jwt.sign(userForToken, process.env.SECRET as jwt.Secret)
    const newCoffee = helper.initialCoffees[1]
    await api
      .post('/api/coffees')
      .set('Authorization', `bearer ${token}`)
      .send(newCoffee)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const coffeesAtEnd = await helper.coffeesInDb()
    expect(coffeesAtEnd.length).toBe(2)

    const name = coffeesAtEnd.map(c => c.name)
    expect(name).toContain(newCoffee.name)
  })
  test('fails without token', async () => {
    const newCoffee = helper.initialCoffees[1]
    await api
      .post('/api/coffees')
      .send(newCoffee)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})
describe('update of an existing coffee', () => {
  test('succeeds with valid data', async () => {
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
    const token = jwt.sign(userForToken, process.env.SECRET as jwt.Secret)
    const coffeesAtStart = await helper.coffeesInDb()
    const coffeeToUpdate = coffeesAtStart[0]
    coffeeToUpdate.stock--
    await api
      .put(`/api/coffees/${coffeeToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(coffeeToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const coffeesAtEnd = await helper.coffeesInDb()
    expect(coffeesAtEnd.length).toBe(1)
    expect(coffeesAtEnd[0].stock).toBe(coffeeToUpdate.stock)
  })
})

describe('deletion of a coffee', () => {
  test('succeeds with valid data', async () => {
    const saltRounds = 10
    const password = 'B.L.U.E.D.E.M.O.N.R.O.C.K.S.'
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username: 'bdemon',
      passwordHash,
      role: 'admin'
    })
    const savedUser = await user.save()
    const coffee = helper.initialCoffees[1]
    const coffeeToDelete = new Coffee({
      name: coffee.name,
      intensity: coffee.intensity,
      price: coffee.price,
      stock: coffee.stock
    })
    await coffeeToDelete.save()
    const coffeesAtStart = await helper.coffeesInDb()

    const userForToken = {
      username: savedUser.username,
      role: savedUser.role,
      id: savedUser._id,
    }
    const token = jwt.sign(userForToken, process.env.SECRET as jwt.Secret)
    await api
      .delete(`/api/coffees/${coffeeToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const coffeesAtEnd = await helper.coffeesInDb()
    expect(coffeesAtEnd).toHaveLength(
      coffeesAtStart.length - 1
    )
    const names = coffeesAtEnd.map(c => c.name)
    expect(names).not.toContain(coffeeToDelete.name)
  })
})

afterAll(() => {
  mongoose.connection.close()
})