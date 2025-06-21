import { NextFunction, Request, Response, Router } from "express";
import { Book } from "../models/book.model";
export const booksRoute = Router();

booksRoute.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Book.create(body);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: { name: error.name, ...error },
    });
  }
});

//have to implement filtering
booksRoute.get("/", async (req: Request, res: Response) => {
  const { filter, sortBy, sort, limit } = req.query;

  const filterQuery = filter ? { genre: filter } : {};
  const limitNumber = parseInt(limit as string) || 10;
  const sortOrder = sort === "desc" ? -1 : 1;

  let books = [];

  if (sortBy) {
    books = await Book.find(filterQuery)
      .sort({ [sortBy as string]: sortOrder })
      .limit(limitNumber);
  } else {
    books = await Book.find(filterQuery).limit(limitNumber);
  }

  res.status(200).json({
    success: true,
    message: "Books retrieved successfully",
    data: books,
  });
});

booksRoute.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  const book = await Book.findById(bookId);

  res.status(200).json({
    success: true,
    message: "Book retrieved successfully",
    data: book,
  });
});

booksRoute.put("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const body = req.body;
  const book = await Book.findByIdAndUpdate(bookId, body, { new: true });

  res.status(200).json({
    success: true,
    message: "Book updated successfully",
    data: book,
  });
});

booksRoute.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  let book = await Book.findByIdAndDelete(bookId);

  // on delete success: data:null (filling requirements )
  if (book) {
    book = null;
  }

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: book,
  });
});
