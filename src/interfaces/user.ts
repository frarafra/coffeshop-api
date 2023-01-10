import { Document } from 'mongoose';
import { Roles } from '../utils/types'

export default interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: Roles;
}