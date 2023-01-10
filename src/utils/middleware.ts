import { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import messages from '../utils/constants'

const { INVALID_ID, INVALID_TOKEN } = messages

dotenv.config();

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Method:', req.method)
    console.log('Path:  ', req.path)
    console.log('Body:  ', req.body)
    console.log('---')
  }
  next()
}

const unknownEndpoint = (_request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error: any, _req: Request, res: Response, next: NextFunction) => {
  console.error(error.message)
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: INVALID_ID })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: INVALID_TOKEN })
  } else {
    return res.status(error.response.status).send({
      code: error.response.status,
      message: error.message
    })
  }
  next(error)
}

const tokenExtractor = (req: any, _res: Response, next: NextFunction) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }
  next()
}

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}