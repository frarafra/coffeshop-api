import { Document } from 'mongoose';
import ICoffee from './coffee';
import IUser from './user';

export default interface IOrder extends Document {
  amount: number;
  quantity: number;
  user: string | IUser;
  coffee: string | ICoffee;
}