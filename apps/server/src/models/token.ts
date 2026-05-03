import { Schema, model, Types } from "mongoose";

interface IToken {
  userId: Types.ObjectId;
  token: string;
}

const tokenSchema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const Token = model<IToken>("Token", tokenSchema);

export default Token;
