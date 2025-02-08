"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const tagsRouter = require("./classes/tags/tags.router");
const todosRouter = require("./classes/todos/todos.router");
const forksRouter = require("./classes/forks/forks.router");
const bmwsRouter = require("./classes/bmws/bmws.router");
const moneyRouter = require("./classes/money/money.router");
const PORT = 8000;
const app = express();
app.use(cookieParser());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    // secure: false,
    // sameSite: "None",
};
app.use(cors(corsOptions));
// app.use(cors());
app.use(express.json());
app.use(tagsRouter);
app.use(todosRouter);
app.use(forksRouter);
app.use(bmwsRouter);
app.use(moneyRouter);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("пошла шарманка на", PORT);
}));
