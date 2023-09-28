import mongoose, {ObjectId} from "mongoose";

export interface UserDocument extends mongoose.Document {
  _id: ObjectId;
  fullname: string;
  email: string;
  password: string;
  otp?: string;
  expirationTime?: Date;
  createdAt: Date;
 }

const userSchema = new mongoose.Schema<UserDocument>({
  fullname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  otp: { type: String },
  expirationTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
 });

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
