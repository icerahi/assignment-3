import { model, Schema } from "mongoose";
import { BookStaticMethods, IBook } from "../interfaces/book.interface";

const bookSchema = new Schema<IBook, BookStaticMethods>(
  {
    title: { type: String, required: [true, "Title is a required field."] },
    author: { type: String, required: [true, "Author is a required field."] },
    genre: {
      type: String,
      enum: {
        values: [
          "FICTION",
          "NON_FICTION",
          "SCIENCE",
          "HISTORY",
          "BIOGRAPHY",
          "FANTASY",
        ],
        message: "'{VALUE}' is not a valid Genre",
      },
      uppercase: true,
    },

    isbn: {
      type: String,
      required: [true, "ISBN is a required field."],
      unique: true,
    },

    description: { type: String },
    copies: {
      type: Number,
      required: [true, "Copies is a required field."],
      min: [0, "Copies must be a positive number"],
    },
    available: { type: Boolean, default: true },
  },
  { versionKey: false, timestamps: true }
);

bookSchema.static("setUnavailable", function setUnavailable(book) {
  book.available = false;
});
export const Book = model<IBook, BookStaticMethods>("Book", bookSchema);
