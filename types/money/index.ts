export interface IMoneyUser {
  id: number;
  name: string;
  token: string;
  balance: number;
  last_activity: string;
}

export interface IMoneyReward {
  id: number;
  name: string;
  level: number;
  price: number;
  description: string;
  profit: string;
}

export interface IMoneyUserReward {
  id: number;
  user_id: number;
  reward_id: number;
  createdat: string;
}
