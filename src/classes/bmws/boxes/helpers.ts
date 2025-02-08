import { IBMWElement } from "../../../../types/bmws/box";

export const getRandomBoxElement = (items: IBMWElement[]) => {
  const totalPercent = items.reduce((sum, item) => sum + item.percent, 0);

  const randomNum = Math.random() * totalPercent;

  let cumulativePercent = 0;

  for (const item of items) {
    cumulativePercent += item.percent;
    if (randomNum <= cumulativePercent) {
      return item;
    }
  }

  return null;
};
