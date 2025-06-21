import { NextFunction, Request, Response, Router } from "express";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";

export const borrowRoute = Router();

//Borrow a book
borrowRoute.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { book: bookId, quantity } = req.body;

      let book = await Book.findById(bookId);
      if (!book) {
        throw new Error(`Book not found with Id ${bookId}`);
      }

      //check if book has enough available copies and then deduct the quantity.
      if (book?.copies && book.copies >= quantity) {
        book.copies = book.copies - quantity;

        if (book.copies === 0) {
          Book.setUnavailable(book); //set available=false, if copies become 0
        }
        await book.save();

        //create new borrow record
        const borrow = await Borrow.create(req.body);

        res.status(200).json({
          success: true,
          message: "Book borrowed successfully",
          data: borrow,
        });
      } else {
        throw new Error("Enough copy not available of the book");
      }
    } catch (error: any) {
      next(error);
    }
  }
);

// Borrowed Books Summary
borrowRoute.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error: any) {
      next(error);
    }
  }
);
