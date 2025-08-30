import type { Diamond } from './types';

const diamonds: Diamond[] = [
  {"id":1,"shape":"ROUND","low_size":0.01,"high_size":0.03,"color":"D","clarity":"IF","carat_price":1100},
  {"id":2,"shape":"ROUND","low_size":0.01,"high_size":0.03,"color":"D","clarity":"VVS1","carat_price":1000},
  {"id":3,"shape":"ROUND","low_size":0.01,"high_size":0.03,"color":"D","clarity":"VVS2","carat_price":900},
  {"id":4,"shape":"ROUND","low_size":0.01,"high_size":0.03,"color":"E","clarity":"IF","carat_price":1000},
  {"id":5,"shape":"ROUND","low_size":0.01,"high_size":0.03,"color":"E","clarity":"VVS1","carat_price":950},
  {"id":6,"shape":"ROUND","low_size":0.01,"high_size":0.03,"color":"E","clarity":"VVS2","carat_price":850},
  {"id":7,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"D","clarity":"IF","carat_price":2650},
  {"id":8,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"D","clarity":"VVS1","carat_price":2500},
  {"id":9,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"D","clarity":"VVS2","carat_price":2300},
  {"id":10,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"D","clarity":"VS1","carat_price":2100},
  {"id":11,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"D","clarity":"VS2","carat_price":1800},
  {"id":12,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"H","clarity":"IF","carat_price":1650},
  {"id":13,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"H","clarity":"VVS1","carat_price":1600},
  {"id":14,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"H","clarity":"VVS2","carat_price":1500},
  {"id":15,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"H","clarity":"VS1","carat_price":1400},
  {"id":16,"shape":"ROUND","low_size":0.3,"high_size":0.39,"color":"H","clarity":"VS2","carat_price":1250},
  {"id":17,"shape":"ROUND","low_size":1,"high_size":1.49,"color":"D","clarity":"IF","carat_price":12000},
  {"id":18,"shape":"ROUND","low_size":1,"high_size":1.49,"color":"D","clarity":"VVS1","carat_price":10500},
  {"id":19,"shape":"ROUND","low_size":1,"high_size":1.49,"color":"D","clarity":"VVS2","carat_price":9400},
  {"id":20,"shape":"ROUND","low_size":1,"high_size":1.49,"color":"G","clarity":"IF","carat_price":8600},
  {"id":21,"shape":"ROUND","low_size":1,"high_size":1.49,"color":"G","clarity":"VVS1","carat_price":8000},
  {"id":22,"shape":"ROUND","low_size":1,"high_size":1.49,"color":"G","clarity":"VS2","carat_price":6700},
  {"id":23,"shape":"PRINCESS","low_size":0.5,"high_size":0.69,"color":"D","clarity":"IF","carat_price":2800},
  {"id":24,"shape":"PRINCESS","low_size":0.5,"high_size":0.69,"color":"D","clarity":"VS1","carat_price":2200},
  {"id":25,"shape":"PRINCESS","low_size":0.5,"high_size":0.69,"color":"G","clarity":"IF","carat_price":2200},
  {"id":26,"shape":"PRINCESS","low_size":0.5,"high_size":0.69,"color":"G","clarity":"VS1","carat_price":1800},
  {"id":27,"shape":"EMERALD","low_size":1,"high_size":1.49,"color":"E","clarity":"VVS2","carat_price":6000},
  {"id":28,"shape":"EMERALD","low_size":1,"high_size":1.49,"color":"E","clarity":"VS1","carat_price":5500},
  {"id":29,"shape":"EMERALD","low_size":1,"high_size":1.49,"color":"F","clarity":"VVS2","carat_price":5400},
  {"id":30,"shape":"EMERALD","low_size":1,"high_size":1.49,"color":"F","clarity":"VS1","carat_price":5000}
];

export function getAllDiamonds(): Diamond[] {
  return diamonds;
}

export function findDiamondPrice(shape: string, color: string, clarity: string, weight: number): number | null {
  const diamond = diamonds.find(d => 
    d.shape.toUpperCase() === shape.toUpperCase() &&
    d.color.toUpperCase() === color.toUpperCase() &&
    d.clarity.toUpperCase() === clarity.toUpperCase() &&
    weight >= d.low_size && weight <= d.high_size
  );
  return diamond ? diamond.carat_price : null;
}

export function getUniqueShapes(): string[] {
  return [...new Set(diamonds.map(d => d.shape))].sort();
}

export function getUniqueColors(): string[] {
  return [...new Set(diamonds.map(d => d.color))].sort();
}

export function getUniqueClarities(): string[] {
  const clarityOrder = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
  const clarities = [...new Set(diamonds.map(d => d.clarity))];
  return clarities.sort((a, b) => {
    const indexA = clarityOrder.indexOf(a);
    const indexB = clarityOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}
