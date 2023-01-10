import { NextFunction, Request, Response } from 'express';
import chalk from 'chalk'
import Coffee from '../models/coffee'
import { Roles } from '../utils/types'
import messages from '../utils/constants'
import validateToken from '../utils/token-helper'
import IToken from '../interfaces/token'

const { ADMIN } = Roles
const { SET_COFFEE, ERROR_AUTHORIZATION } = messages

const getCoffees = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const coffees = await Coffee.find({})
    res.json(coffees.map(coffee => coffee.toJSON()))
  } catch(error) {
    next(error)
  }
}

const createCoffee = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body
  try {
    const decodedToken: IToken = validateToken(req, res)
    if (decodedToken.role !== ADMIN) {
      return res.status(403).json({ code: 403, message: ERROR_AUTHORIZATION })
    }
    const { name, intensity, price, stock } = body
    const coffee = new Coffee({ name, intensity, price, stock })
    const savedCoffee = await coffee.save()
    if (!savedCoffee) {
      return res.status(500).end()
    }
    console.log(chalk.bold(`${SET_COFFEE}:`) + '\n' + JSON.stringify({ name, intensity, price, stock }))
    return res.status(201).json(savedCoffee.toJSON())
  } catch(error) {
    next(error)
  }
}

const updateCoffee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decodedToken: IToken = validateToken(req, res)
    if (decodedToken.role !== ADMIN) {
      return res.status(403).json({ code: 403, message: ERROR_AUTHORIZATION })
    }
    const updatedCoffee = await Coffee.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedCoffee) {
      return res.status(404).end()
    }
    return res.json(updatedCoffee.toJSON())
  } catch(error) {
    next(error)
  }
}

const deleteCoffee = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decodedToken: IToken = validateToken(req, res)
    if (decodedToken.role !== ADMIN) {
      return res.status(403).json({ code: 403, message: ERROR_AUTHORIZATION })
    }
    const coffee = await Coffee.findById(req.params.id)
    if (!coffee) {
      return res.status(404).end()
    }
    await coffee.remove()
    return res.status(204).end()
  } catch(error) {
    next(error)
  }
}

export default {
  getCoffees,
  createCoffee,
  updateCoffee,
  deleteCoffee,
}