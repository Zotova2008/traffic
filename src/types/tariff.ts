export interface Tariff {
  id: string;
  period: string;
  price: number;
  full_price: number;
  is_best: boolean;
  text: string;
}

export interface TariffWithDiscount extends Tariff {
  discountPercent: number;
}
