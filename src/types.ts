export interface RateRow {
  company: string;
  product: string;
  model: string;
  cash?: number | string;
  installment?: number | string;
  fixed?: number | string;
  remarks?: string;
  month?: string;
  year?: number | string;
}
