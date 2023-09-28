import mongoose, {ObjectId} from "mongoose";

export interface SecretsDocument extends mongoose.Document {
  _id: ObjectId;
  userId: ObjectId;
  secret: string;
  createdAt: Date;
 }

const secretsSchema = new mongoose.Schema<SecretsDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  secret: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
 });

const Secrets = mongoose.model<SecretsDocument>("Secrets", secretsSchema);
export default Secrets;
