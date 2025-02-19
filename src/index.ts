import { NextFunction } from "express";

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const tagsRouter = require("./classes/tags/tags.router");
const todosRouter = require("./classes/todos/todos.router");
const forksRouter = require("./classes/forks/forks.router");
const bmwsRouter = require("./classes/bmws/bmws.router");
const moneyRouter = require("./classes/money/money.router");
const documentsRouter = require("./classes/documents/documents.router");

const PORT = 8000;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  // secure: false,
  sameSite: "Lax",
};

app.use((req: Request, res: Response, next: NextFunction) => {
  res.headers.set(
    "Access-Control-Allow-Origin",
    "http://your-frontend-domain.com"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cookieParser());
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());
app.use(tagsRouter);
app.use(todosRouter);
app.use(forksRouter);
app.use(bmwsRouter);
app.use(moneyRouter);
app.use(documentsRouter);

app.listen(PORT, async () => {
  console.log("пошла шарманка на", PORT);
});
