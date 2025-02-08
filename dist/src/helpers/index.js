"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayToQuotedString = void 0;
const arrayToQuotedString = (array) => {
    if (!Array.isArray(array)) {
        throw new Error("Input must be an array");
    }
    const quotedArray = array.map((item) => `${item}`);
    return `[${quotedArray.join(", ")}]`;
};
exports.arrayToQuotedString = arrayToQuotedString;
