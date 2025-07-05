import { NextFunction, Request, Response, Router } from "express";
import { Book } from "../models/book.model";
export const booksRoute = Router();

//create book
booksRoute.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const book = await Book.create(body);

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

// Retrieve all books and filters
booksRoute.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { filter, sortBy, sort, limit } = req.query;

    const filterQuery = filter ? { genre: filter } : {};
    const limitNumber = parseInt(limit as string);
    const sortOrder = sort === "desc" ? -1 : 1;

    let books = [];

    //filtering and sorting
    if (sortBy) {
      books = await Book.find(filterQuery)
        .sort({ [sortBy as string]: sortOrder })
        .limit(limitNumber);
    } else {
      books = await Book.find(filterQuery)
        .sort({ createdAt: "desc" })
        .limit(limitNumber);
    }

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error: any) {
    next(error);
  }
});

//Retrieve a book by Id
booksRoute.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;

      const book = await Book.findOne({ _id: bookId });

      if (!book) {
        throw new Error(`No book found with Id '${bookId}'`);
      }

      res.status(200).json({
        success: true,
        message: "Book retrieved successfully",
        data: book,
      });
    } catch (error: any) {
      next(error);
    }
  }
);

//Update a book
booksRoute.put(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;
      const body = req.body;

      // findOneAndUpdate triggers post middleware
      const book = await Book.findOneAndUpdate({ _id: bookId }, body, {
        new: true,
        runValidators: true,
      });

      if (!book) {
        throw new Error(`No book found with Id '${bookId}'`);
      }

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

//Delete a book
booksRoute.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = req.params.bookId;

      //findOneAndDelete triggers pre middleware
      const book = await Book.findOneAndDelete({ _id: bookId });

      if (!book) {
        throw new Error(`Book not found with Id ${bookId}`);
      }

      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: null, // return null as per requirements
      });
    } catch (error: any) {
      next(error);
    }
  }
);
