import { Schema, model, type Types } from "mongoose";

export interface IComment {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog" },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      type: String,
      required: true,
      maxlength: [1000, "Content must be at most 1000 characters long"],
    },
  },
  { timestamps: true }
);

const Comment = model<IComment>("Comment", commentSchema);

export default Comment;
