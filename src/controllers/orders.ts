import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk'
import Order from '../models/order'
import User from '../models/user'
import Coffee from '../models/coffee'
import { Roles } from '../utils/types'
import messages from '../utils/constants'
import validateToken from '../utils/token-helper'
import checkDisponibility from '../utils/coffee-helper'
import IToken from '../interfaces/token'

const { ADMIN } = Roles
const { SET_ORDER, ERROR_SET_ORDER, UPDATE_COFFEE, OUT_OF_STOCK, COFFE_CONSUMED, COFFE_ORDERED, ERROR_AUTHORIZATION }
  = messages

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decodedToken: IToken = validateToken(req, res)
    if (decodedToken.role !== ADMIN) {
      return res.status(403).json({ code: 403, message: ERROR_AUTHORIZATION })
    }
    const orders = await Order
      .find({})
      .populate('coffee', { name: 1 })
      .populate('user', { username: 1 })
    if (!orders) {
      return res.status(200).end()
    }
    return res.json(orders.map(order => order.toJSON()))
  } catch(error) {
    next(error)
  }
}

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body
  try {
    const decodedToken: IToken = validateToken(req, res)
    const user = await User.findById(decodedToken.id)
    if (!user) {
      return res.status(404).end()
    }
    const { coffee, quantity } = body
    const coffeeObject = await Coffee.findOne({ name: coffee })
    if (!coffeeObject) {
      return res.status(404).end()
    }
    if (checkDisponibility(coffeeObject, quantity)) {
      const amount = quantity*coffeeObject.price
      const order = new Order({
        amount,
        quantity,
        user: user._id,
        coffee: coffeeObject._id
      })
      const savedOrder = await order.save()
      console.log(chalk.bold(`${SET_ORDER}: `) + COFFE_ORDERED(quantity) + '\n'
        + JSON.stringify({ user_id: user._id, coffee_id: coffeeObject._id, amount, quantity }))
      coffeeObject.stock -= quantity
      await coffeeObject.save()
      console.log(chalk.bold(`${UPDATE_COFFEE} ${coffee}: `) + COFFE_CONSUMED(quantity) + '\n'
        + JSON.stringify({ name: coffeeObject.name, intensity: coffeeObject.intensity, price: coffeeObject.price, stock: coffeeObject.stock }))
        res.status(201).json(savedOrder.toJSON())
    } else {
      console.log(chalk.bold(ERROR_SET_ORDER + ':'), OUT_OF_STOCK)
      res.status(200).json({ code: 200, message: OUT_OF_STOCK })
    }
  } catch(error) {
    next(error)
  }
}

export default {
  getOrders,
  createOrder,
}