import { Response } from 'express';
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv';
import messages from '../utils/constants'

const { MISSING_TOKEN, INVALID_TOKEN } = messages

dotenv.config();

const validateToken = (req: any, res: Response)=> {
  const token: string = req.token
  if (!token) {
    return res.status(401).json({ code: 401, error: MISSING_TOKEN })
  }
  const decodedToken = <any>jwt.verify(token, process.env.SECRET as jwt.Secret)
  if (!decodedToken.id) {
    return res.status(401).json({ code: 401, error: INVALID_TOKEN })
  }
  return decodedToken
}

export default validateToken