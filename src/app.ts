import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'

import config from './utils/config'
import routes from './routes'
import middleware from './utils/middleware'
import IRequest from './interfaces/request';
import messages from './utils/constants'

const { INFO_DB_CONNECTION, ERROR_DB_CONNECTION } = messages

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI as string, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(INFO_DB_CONNECTION)
  })
  .catch((error) => {
    console.log(ERROR_DB_CONNECTION, error.message)
  })

const app = express()

morgan.token('req-body', (req: IRequest) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))
app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/', routes)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app