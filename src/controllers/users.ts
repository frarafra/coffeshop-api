import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt'

import User from '../models/user'
import { Roles } from '../utils/types'
import messages from '../utils/constants'
import validateToken from '../utils/token-helper'
import IToken from '../interfaces/token'

const { ADMIN, CUSTOMER } = Roles
const { MISSING_CONTENT, INVALID_ROLE, ERROR_AUTHORIZATION } = messages

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decodedToken: IToken = validateToken(req, res)
    if (decodedToken.role !== ADMIN) {
      return res.status(403).json({ code: 403, message: ERROR_AUTHORIZATION })
    }
    const users = await User.find({})
    if (!users) {
      return res.status(200).end()
    }
    res.json(users.map(user => user.toJSON()))
  } catch(error) {
    next(error)
  }
}

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decodedToken: IToken = validateToken(req, res)
    if (decodedToken.role !== ADMIN) {
      return res.status(403).json({ code: 403, message: ERROR_AUTHORIZATION })
    }
    const body = req.body
    const { username, password, role } = body

    if (!username || !password) {
      return res.status(400).json({
        error: MISSING_CONTENT
      })
    }
    if (role !== ADMIN && role !== CUSTOMER) {
      return res.status(400).json({
        error: INVALID_ROLE
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      role: body.role,
      passwordHash,
    })
    const savedUser = await user.save()
    if (!savedUser) {
      return res.status(500).end()
    }
    res.json(savedUser)
  } catch (error) {
    next(error)
  }
}

export default {
  getUsers,
  createUser,
}