import { Schema, model, HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";

type UserDocument = HydratedDocument<IUser>;

// Define the IUser interface to represent the structure of a user document in MongoDB
export interface IUser {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    github?: string;
    x?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose schema for the User model
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      unique: [true, "Username already exists"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      maxlength: [50, "Email cannot exceed 50 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["user", "admin"],
        message: "{VALUE} is not a valid role",
      },
      default: "user",
    },
    firstName: {
      type: String,
      maxlength: [30, "First name cannot exceed 30 characters"],
    },
    lastName: {
      type: String,
      maxlength: [30, "Last name cannot exceed 30 characters"],
    },
    socialLinks: {
      website: {
        type: String,
        maxlength: [100, "Website URL cannot exceed 100 characters"],
      },
      linkedin: {
        type: String,
        maxlength: [100, "LinkedIn URL cannot exceed 100 characters"],
      },
      github: {
        type: String,
        maxlength: [100, "GitHub URL cannot exceed 100 characters"],
      },
      x: {
        type: String,
        maxlength: [100, "X URL cannot exceed 100 characters"],
      },
      facebook: {
        type: String,
        maxlength: [100, "Facebook URL cannot exceed 100 characters"],
      },
      instagram: {
        type: String,
        maxlength: [100, "Instagram URL cannot exceed 100 characters"],
      },
      youtube: {
        type: String,
        maxlength: [100, "YouTube URL cannot exceed 100 characters"],
      },
    },
  },
  {
    timestamps: true,
  }
);

// before saving a user document, hash the password if it has been modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  // next();
});

// Create the User model using the schema and export it
const User = model<IUser>("User", userSchema);

export default User;
