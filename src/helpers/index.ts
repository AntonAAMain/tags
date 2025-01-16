export const arrayToQuotedString = (array: string[]) => {
  if (!Array.isArray(array)) {
    throw new Error("Input must be an array");
  }

  const quotedArray = array.map((item) => `'${item}'`);

  return `[${quotedArray.join(", ")}]`;
};
