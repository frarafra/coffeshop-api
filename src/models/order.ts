import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'
import IOrder from '../interfaces/order';

const OrderSchema: Schema = new Schema({
  amount: { type: Number, min: 0 },
  quantity: { type: Number, min: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  coffee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coffee'
  },
})
OrderSchema.plugin(uniqueValidator)
OrderSchema.set('toJSON', {
  transform: (_document: any, returnedObject: IOrder) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Order = mongoose.model<IOrder>('Order', OrderSchema)

export default Order 