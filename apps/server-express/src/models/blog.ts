import { Schema, model, Types } from "mongoose";

import { genSlug } from "@/utils";
import { Document } from "mongoose";

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  banner: {
    url: string;
    publicId: string;
    width: number;
    height: number;
  };
  author: Types.ObjectId;
  viewsCount: number;
  likesCount: number;
  commentsCounts: number;
  status: "draft" | "published";
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [180, "Title cannot exceed 180 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: [true, "Slug must be unique"],
      maxlength: [180, "Slug cannot exceed 180 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    banner: {
      url: {
        type: String,
        required: [true, "Banner URL is required"],
      },
      publicId: {
        type: String,
        required: [true, "Banner public ID is required"],
      },
      width: {
        type: Number,
        required: [true, "Banner width is required"],
      },
      height: {
        type: Number,
        required: [true, "Banner height is required"],
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCounts: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      // enum: ["draft", "published"],
      enum: {
        values: ["draft", "published"],
        message: "{VALUE} is not supported.",
      },
      default: "draft",
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
      updatedAt: "updatedAt",
    },
  }
);

blogSchema.pre("validate", async function () {
  if (this.title && !this.slug) {
    this.slug = genSlug(this.title);
  }
  // no next() needed - just return or throw to signal an error
});

const Blog = model<IBlog>("Blog", blogSchema);

export default Blog;
