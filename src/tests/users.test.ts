import mongoose from 'mongoose'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import app from '../app'
import User from '../models/user'

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('when creating a new user', () => {
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
  test('succeedes with valid data', async () => {
    const newUser = { username: 'Bob', password: 'yo123', role: 'customer' }
    await api
      .post('/api/users')
      .set('Authorization', `bearer ${token}`)
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('should provide username and password otherwise the response is 400 bad request', async () => {
    const newUser = { username: 'Bob' }
    await api
      .post('/api/users')
      .set('Authorization', `bearer ${token}`)
      .send(newUser)
      .expect(400, {
        error: 'content missing' })
  })
  test('should provide password with at least 3 characters long', async () => {
    const newUser = { username: 'Bob', password: 'yo123', role: '' }
    await api
      .post('/api/users')
      .set('Authorization', `bearer ${token}`)
      .send(newUser)
      .expect(400, {
        error: 'invalid role' })
  })
})

afterAll(() => {
  mongoose.connection.close()
})