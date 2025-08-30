export type Diamond = {
  id: number;
  shape: string;
  low_size: number;
  high_size: number;
  color: string;
  clarity: string;
  carat_price: number;
};

export type CalculationInput = {
  shape: string;
  color: string;
  clarity: string;
  weight: number;
  discount: number;
};

export type CalculationResult = {
  basePrice: number;
  discountedPricePerCarat: number;
  finalAmount: number;
  caratPrice: number;
};

export type HistoryItem = {
  id: string;
  input: CalculationInput;
  result: CalculationResult;
  timestamp: string;
};
