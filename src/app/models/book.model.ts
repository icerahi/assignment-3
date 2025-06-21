import { model, Schema } from "mongoose";
import { BookStaticMethods, IBook } from "../interfaces/book.interface";
import { Borrow } from "./borrow.model";

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

// when book copies = 0, this method call will set book `available=false`
bookSchema.static("setUnavailable", function setUnavailable(book) {
  book.available = false;
});

//when new copies of book added, it will auto-set `available=true`
bookSchema.post("findOneAndUpdate", async function (doc, next) {
  if (doc && doc.copies !== 0 && doc.available === false) {
    doc.available = true;
    await doc.save();
  }
  next();
});

//implementing on-delete cascade using pre middleware
bookSchema.pre("findOneAndDelete", async function (next) {
  const filter = this.getFilter();
  const bookId = filter._id;
  const book = await this.model.findById(bookId);
  if (book) {
    await Borrow.deleteMany({ book: book._id });
  }
  next();
});

export const Book = model<IBook, BookStaticMethods>("Book", bookSchema);
