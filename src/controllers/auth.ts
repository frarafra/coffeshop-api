import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/user'
import messages from '../utils/constants'

const { ERROR_AUTHENTICATION } = messages

const login = async (req: Request, res: Response) => {
  const body = req.body

  const user = await User.findOne({ username: body.username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: ERROR_AUTHENTICATION
    })
  }

  const userForToken = {
    username: user.username,
    role: user.role,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET as string)
  if (!token) {
    return res.status(401).end()
  }
  res
    .status(200)
    .send({ token, username: user.username, role: user.role })
}

export default {
  login,
}