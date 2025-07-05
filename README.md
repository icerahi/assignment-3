# 📚 Library Management API

A simple RESTful API built with **TypeScript**, **Express**, and **MongoDB** for managing a library's book inventory and borrow records. This API allows you to create, update, delete, and fetch books and track borrowing activity.

## 🌐 Live

🔗 [https://assignment-3-two-pi.vercel.app/api/books](https://assignment-3-two-pi.vercel.app/)

## 🚀 Features

- Add, update, delete, and retrieve books.
- Borrow books and track borrowing quantities.
- Auto-update book availability based on stock.
- Aggregated summary of borrowed books.
- Proper error handling and middleware support.
- Mongoose schema hooks (middleware) for dynamic behavior.
- Clean project structure with TypeScript.

---

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose

---

## 📁 Project Structure

```
src
├── app
│   ├── controllers
│   │   ├── books.controller.ts
│   │   └── borrow.controller.ts
│   ├── interfaces
│   │   ├── book.interface.ts
│   │   └── borrow.interface.ts
│   └── models
│       ├── book.model.ts
│       └── borrow.model.ts
├── app.ts
└── server.ts

```

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/icerahi/assignment-3.git
cd assignment-3
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root folder:

```env
DATABASE_URL=your_mongodb_connection_string
```

### 4. Run the project in development

```bash
npm run dev
```

### 5. Build and run the project in production

```bash
npm run build
```

---

## 🚀 API Endpoints

### 🔹 Books

| Method | Endpoint                                                       | Description                   |
| ------ | -------------------------------------------------------------- | ----------------------------- |
| GET    | `/api/books`                                                   | Get all books                 |
| GET    | `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5` | Filter, sort, and limit books |
| GET    | `/api/books/:bookId`                                           | Get book by ID                |
| POST   | `/api/books`                                                   | Add a new book                |
| PUT    | `/api/books/:bookId`                                           | Update an existing book       |
| DELETE | `/api/books/:bookId`                                           | Delete a book                 |

### 🔹 Borrow

| Method | Endpoint      | Description                          |
| ------ | ------------- | ------------------------------------ |
| POST   | `/api/borrow` | Borrow a book (deduct copies)        |
| GET    | `/api/borrow` | Get summary: total quantity per book |

---

## Example API Response (GET `/api/borrow`)

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    },
    {
      "book": {
        "title": "1984",
        "isbn": "9780451524935"
      },
      "totalQuantity": 3
    }
  ]
}
```

---

## 📓 Notes

- Book availability (`available`) is automatically updated when copies run out or are restocked.
- Proper error messages and status codes are returned via a global error handler.
- MongoDB Aggregation is used to summarize borrowed books efficiently.

---

## 🧑‍💻 Author

**Imran Hasan**
GitHub: [@icerahi](https://github.com/icerahi)
