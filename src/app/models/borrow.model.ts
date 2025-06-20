import { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required."],
    },
    quantity: {
      type: Number,
      requied: [true, "Quantity is required."],
      min: [1, "Quantity must be a positive integer, but got {VALUE}"],
    },

    dueDate: {
      type: Date,
      required: [true, "Duedate is required."],
    },
  },
  { versionKey: false, timestamps: true }
);

export const Borrow = model("Borrow", borrowSchema);
