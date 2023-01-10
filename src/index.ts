import app from './app'
import http from 'http'
import config from './utils/config'
import messages from './utils/constants'

const { INFO_SERVER_RUNNING } = messages

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`${INFO_SERVER_RUNNING} ${config.PORT}`)
})