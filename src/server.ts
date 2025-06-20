import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5000;
let server: Server;

async function main() {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}`);

    console.log("Mongodb with mongoose connected!");

    server = app.listen(PORT, () => {
      console.log("App is listening on the port", PORT);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
