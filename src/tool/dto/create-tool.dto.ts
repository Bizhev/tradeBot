export class CreateToolDto {
  lot: number;
  minPriceIncrement: number;
  name: string;
  type: string;
  currency: string;
  isin: string;
  figi: string;
  country?: string;
  ticker: string;
  faceValue?: number;
}
