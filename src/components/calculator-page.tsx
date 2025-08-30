"use client";

import React, { useState, useEffect } from 'react';
import type { Diamond, CalculationInput, CalculationResult, HistoryItem } from '@/lib/types';
import Header from '@/components/header';
import CalculatorForm from '@/components/calculator-form';
import CalculationResultDisplay from '@/components/calculation-result';
import DiamondTable from '@/components/diamond-table';
import SearchHistory from '@/components/search-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface CalculatorPageProps {
  diamonds: Diamond[];
  shapes: string[];
  colors: string[];
  clarities: string[];
}

export default function CalculatorPage({ diamonds, shapes, colors, clarities }: CalculatorPageProps) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('diamond-calc-history');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
    }
  }, []);

  const updateHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('diamond-calc-history', JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };

  const handleCalculation = (newResult: CalculationResult, input: CalculationInput) => {
    setResult(newResult);
    setError(null);
    const newHistoryItem: HistoryItem = {
      id: new Date().toISOString(),
      input,
      result: newResult,
      timestamp: new Date().toLocaleString(),
    };
    updateHistory([newHistoryItem, ...history].slice(0, 20)); // Keep latest 20
  };

  const handleClearHistory = () => {
    updateHistory([]);
  };

  const handleCalculationError = (errorMessage: string) => {
    setError(errorMessage);
    setResult(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <CalculatorForm
              onCalculate={handleCalculation}
              onError={handleCalculationError}
              shapes={shapes}
              colors={colors}
              clarities={clarities}
            />
            {(result || error) && (
               <CalculationResultDisplay result={result} error={error} />
            )}
          </div>
          <div className="lg:col-span-2">
            <Tabs defaultValue="data" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="data">Price Data</TabsTrigger>
                <TabsTrigger value="history">Calculation History</TabsTrigger>
              </TabsList>
              <TabsContent value="data">
                <Card>
                  <CardContent className="p-2 md:p-6">
                    <DiamondTable data={diamonds} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history">
                 <Card>
                  <CardContent className="p-4 md:p-6">
                    <SearchHistory history={history} onClear={handleClearHistory} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
       <footer className="text-center p-4 text-sm text-muted-foreground">
        <p>Diamond RAP Calculator. Prices are for reference only.</p>
      </footer>
    </div>
  );
}
