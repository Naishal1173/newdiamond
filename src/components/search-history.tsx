"use client";

import React from 'react';
import type { HistoryItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, History } from 'lucide-react';
import { Badge } from './ui/badge';

type SearchHistoryProps = {
  history: HistoryItem[];
  onClear: () => void;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function SearchHistory({ history, onClear }: SearchHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5"/>
            <span>History</span>
        </h3>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center text-muted-foreground py-16">
          <p>Your calculation history will appear here.</p>
        </div>
      ) : (
        <ScrollArea className="h-96 rounded-md border">
          <div className="p-4 space-y-4">
            {history.map((item) => (
              <div key={item.id} className="p-4 bg-secondary rounded-lg space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-foreground">
                        {item.input.weight}ct {item.input.shape}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.timestamp}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-primary">{formatCurrency(item.result.finalAmount)}</div>
                  </div>
                </div>
                 <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline">Color: {item.input.color}</Badge>
                    <Badge variant="outline">Clarity: {item.input.clarity}</Badge>
                    <Badge variant="outline">Discount: {item.input.discount}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
