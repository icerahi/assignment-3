import { Request, Response, Router } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";

export const borrowRoute = Router();

borrowRoute.post("/", async (req: Request, res: Response) => {
  try {
    const { book: bookId, quantity, dueData } = req.body;

    let book = await Book.findById(bookId);

    if (book?.copies && book.copies >= quantity) {
      book.copies = book.copies - quantity;

      if (book.copies === 0) {
        Book.setUnavailable(book);
      }

      await book.save();

      const borrow = await Borrow.create(req.body);

      res.status(200).json({
        success: true,
        message: "Book borrowed successfully",
        data: borrow,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Enough copy not available of the book",
      });
    }
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
      success: false,
      error: error,
    });
  }
});

borrowRoute.get("/", async (req: Request, res: Response) => {
  const books = await Borrow.aggregate([
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "book",
      },
    },
    { $unwind: "$book" },
    {
      $group: {
        _id: "$book",
        totalQuantity: { $sum: "$quantity" },
      },
    },

    {
      $project: {
        _id: 0,
        book: { title: "$_id.title", isbn: "$_id.isbn" },
        totalQuantity: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Borrowed books summary retrieved successfully",
    data: books,
  });
});
