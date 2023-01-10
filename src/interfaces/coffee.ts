import { Document } from 'mongoose';

export default interface ICoffee extends Document {
  name: string;
  intensity: number;
  price: number;
  stock: number;
}