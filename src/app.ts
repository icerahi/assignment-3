import express, { Application, NextFunction, Request, Response } from "express";
import { booksRoute } from "./app/controllers/books.controller";
import { borrowRoute } from "./app/controllers/borrow.controller";
import cors from "cors";

const app: Application = express();
app.use(express.json());
app.use(cors())

//routes
app.use("/api/books", booksRoute);
app.use("/api/borrow", borrowRoute);

app.get("/", (req: Request, res: Response) => {
  res.send(
    "Welcome to Library Management API with Express, TypeScript & MongoDB!"
  );
});

//404Not found handling
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "Requested endpoint not found!",
    success: false,
  });
});

//Global error handling
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error) {
    res.status(400).json({
      message: error.message,
      success: false,
      error: { name: error.name, ...error },
    });
  }
});

export default app;
