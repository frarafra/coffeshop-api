import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'
import ICoffee from '../interfaces/coffee';

const CoffeeSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  intensity: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 }
})

CoffeeSchema.plugin(uniqueValidator)
CoffeeSchema.set('toJSON', {
  transform: (_document: any, returnedObject: ICoffee) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Coffee = mongoose.model<ICoffee>('Coffee', CoffeeSchema)

export default Coffee