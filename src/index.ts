const express = require("express");
const cors = require("cors");

const tagsRouter = require("./classes/tags/tags.router");
const todosRouter = require("./classes/todos/todos.router");
const forksRouter = require("./classes/forks/forks.router");

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(tagsRouter);
app.use(todosRouter);
app.use(forksRouter);

app.listen(PORT, async () => {
  console.log("пошла шарманка на ", PORT);
});
