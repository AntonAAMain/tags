export interface IBMWBox {
  id: number;
  name: string;
  img: string;
  price: number;
}

export interface IBMWElement {
  id: number;
  box_id: number;
  car_id: number;
  percent: number;
}

export interface IBMWCar {
  id: number;
  name: string;
  photo: string;
  price: number;
}
