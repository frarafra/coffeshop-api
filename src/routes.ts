import Router from 'express'
import authController from './controllers/auth'
import usersController from './controllers/users'
import coffeeController from './controllers/coffees'
import ordersController from './controllers/orders'

const { login } = authController
const { getUsers, createUser } = usersController
const { getCoffees, deleteCoffee, createCoffee, updateCoffee } = coffeeController
const { getOrders, createOrder } = ordersController

const router = Router()

router.post('/login', login)

router.get('/users', getUsers)
router.post('/users', createUser)

router.get('/coffees', getCoffees)
router.delete('/coffees/:id', deleteCoffee)
router.post('/coffees', createCoffee)
router.put('/coffees/:id', updateCoffee)

router.get('/orders', getOrders)
router.post('/orders', createOrder)

export default router