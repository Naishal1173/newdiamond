import CalculatorPage from '@/components/calculator-page';
import { getAllDiamonds, getUniqueClarities, getUniqueColors, getUniqueShapes } from '@/lib/diamond-data';

export default function Home() {
  const diamonds = getAllDiamonds();
  const shapes = getUniqueShapes();
  const colors = getUniqueColors();
  const clarities = getUniqueClarities();

  return (
    <CalculatorPage
      diamonds={diamonds}
      shapes={shapes}
      colors={colors}
      clarities={clarities}
    />
  );
}
