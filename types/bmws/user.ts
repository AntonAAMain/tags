export interface IBMWUser {
  id: number;
  balance: number;
  token: string;
  name: string;
  opened_cases: number;
  best_car_id: number | null;
}
