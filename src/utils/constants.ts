const messages = {
  SET_COFFEE: 'SET COFFEE',
  UPDATE_COFFEE: 'UPDATE COFFEE',
  SET_ORDER: 'SET ORDER',
  ERROR_SET_ORDER: 'ERROR SET ORDER',
  OUT_OF_STOCK: 'out of stock',
  COFFE_ORDERED: (n: number) => (`order ${n} units of coffee`),
  COFFE_CONSUMED: (n: number) => (`${n} units of coffee consumed`),
  INFO_SERVER_RUNNING: 'Server running on port',
  INFO_DB_CONNECTION: 'connected to MongoDB',
  ERROR_DB_CONNECTION: 'error connection to MongoDB:',
  ERROR_AUTHENTICATION: 'invalid username or password',
  ERROR_AUTHORIZATION: 'unauthorized error',
  MISSING_CONTENT: 'content missing',
  MISSING_TOKEN: 'token missing',
  INVALID_ROLE: 'invalid role',
  INVALID_TOKEN: 'invalid token',
  INVALID_ID: 'malformatted id',
}

export default messages