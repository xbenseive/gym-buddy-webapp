import mongoose, { Schema, Document } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: "member" | "trainer" | "admin";
  bookedClasses: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUserDoc>({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["member", "trainer", "admin"],
    default: "member",
  },
  bookedClasses: [{ type: Schema.Types.ObjectId, ref: "Class" }],
});

export default mongoose.models.User ||
  mongoose.model<IUserDoc>("User", UserSchema);
