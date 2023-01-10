import mongoose, { Schema } from 'mongoose';
import IUser from '../interfaces/user';

const UserSchema: Schema = new Schema({
  username: { type: String, minlength: 3, required: true, unique: true },
  passwordHash: String,
  role: { type: String, enum : ['admin','customer'], default: 'customer' }
})

UserSchema.set('toJSON', {
  transform: (_document: any, returnedObject: IUser) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model<IUser>('User', UserSchema)

export default User