"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { CalculationResult } from '@/lib/types';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

type CalculationResultDisplayProps = {
  result: CalculationResult | null;
  error: string | null;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function CalculationResultDisplay({ result, error }: CalculationResultDisplayProps) {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Calculation Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!result) {
    return null;
  }

  const isSurcharge = result.finalAmount > result.basePrice;

  return (
    <Card className="shadow-lg animate-in fade-in-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSurcharge ? <TrendingUp className="h-6 w-6 text-destructive" /> : <TrendingDown className="h-6 w-6 text-green-600" />}
          <span>Calculation Result</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-baseline p-3 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground">Price / Carat</p>
          <p className="font-semibold text-lg">{formatCurrency(result.caratPrice)}</p>
        </div>
        <div className="flex justify-between items-baseline p-3 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground">Base Price</p>
          <p className="font-semibold text-lg">{formatCurrency(result.basePrice)}</p>
        </div>
        <div className="flex justify-between items-baseline p-3 bg-secondary rounded-lg">
          <p className="text-sm text-muted-foreground">Discounted Price / Carat</p>
          <p className="font-semibold text-lg">{formatCurrency(result.discountedPricePerCarat)}</p>
        </div>
        <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground rounded-lg">
          <p className="text-lg font-bold">Final Amount</p>
          <p className="text-2xl font-extrabold">{formatCurrency(result.finalAmount)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
