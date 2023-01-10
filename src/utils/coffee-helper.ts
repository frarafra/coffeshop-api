import ICoffee from "../interfaces/coffee"

const checkDisponibility = (coffee: ICoffee, quantity: number) => {
  return coffee.stock - quantity >= 0 ? true : false
}

export default checkDisponibility