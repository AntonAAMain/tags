import { IMoneyReward } from "../../../../types/money";

export const getStructedRewardsByName = (allRewards: IMoneyReward[]) => {
  const array: IMoneyReward[][] = [];

  for (let i = 0; i < allRewards.length; i++) {
    if (array.length === 0) {
      array.push([allRewards[i]]);
    } else {
      let wasPushed = false;
      for (let j = 0; j < array.length; j++) {
        if (array[j][0].name === allRewards[i].name) {
          array[j].push(allRewards[i]);
          wasPushed = true;
        }
      }

      if (!wasPushed) {
        array.push([allRewards[i]]);
      }
    }
  }

  return array;
};

export const getMaxLevelReward = (rewards: IMoneyReward[]): IMoneyReward => {
  return rewards.reduce((maxReward, currentReward) => {
    return currentReward.level > maxReward.level ? currentReward : maxReward;
  }, rewards[0]);
};

export const getLastRewards = (
  structedRewards: IMoneyReward[][],
  allUserRewards: IMoneyReward[]
) => {
  const result: (IMoneyReward | { isLast: boolean })[] = [];

  for (let i = 0; i < structedRewards.length; i++) {
    const userMaxPurchasedReward = getMaxLevelReward(
      allUserRewards.filter(
        (userReward) => userReward.name === structedRewards[i][0].name
      )
    );

    const foundMaxReward = structedRewards[i].find(
      (el) => el.level - 1 === userMaxPurchasedReward?.level
    );

    if (userMaxPurchasedReward && foundMaxReward) {
      result.push(foundMaxReward);
    } else if (
      getMaxLevelReward(structedRewards[i]).level ===
      userMaxPurchasedReward?.level
    ) {
      result.push({
        ...structedRewards[i][structedRewards[i].length - 1],
        isLast: true,
      });
    } else result.push(structedRewards[i][0]);
  }

  return result;

  // allStructedRewards.map((structedReward) => {
  //     return {
  //       reward: structedReward,
  //       userReward: getMaxLevelReward(
  //         allUserTypedRewards.filter(
  //           (userReward) => userReward.name === structedReward[0].name
  //         )
  //       ),
  //       finalReward: structedReward.find((el) =>
  //         getMaxLevelReward(
  //           allUserTypedRewards.filter(
  //             (userReward) => userReward.name === structedReward[0].name
  //           )
  //         )
  //           ? el.level - 1 ===
  //             getMaxLevelReward(
  //               allUserTypedRewards.filter(
  //                 (userReward) => userReward.name === structedReward[0].name
  //               )
  //             )?.level
  //           : structedReward[0]
  //       ),
  //     };
};
