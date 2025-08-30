import React from 'react';
import { DiamondIcon } from './icons';

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <div className="text-primary">
           <DiamondIcon className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
          Diamond RAP Calculator
        </h1>
      </div>
    </header>
  );
}
