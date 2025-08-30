
"use server";

import { z } from "zod";
import { findDiamondPrice } from "./diamond-data";
import type { CalculationResult } from "./types";

const CalculationSchema = z.object({
  shape: z.string().min(1, "Shape is required."),
  color: z.string().min(1, "Color is required."),
  clarity: z.string().min(1, "Clarity is required."),
  weight: z.number().positive("Weight must be a positive number."),
  discount: z.number().min(-100, "Discount cannot be less than -100%").max(100, "Discount cannot be more than 100%"),
});

export async function calculatePrice(
  input: z.infer<typeof CalculationSchema>
): Promise<{ success: true; data: CalculationResult } | { success: false; error: string }> {
  const validatedFields = CalculationSchema.safeParse(input);

  if (!validatedFields.success) {
    // Return a more detailed error message
    const error = validatedFields.error.issues.map(i => i.message).join(', ');
    return { success: false, error: error || "Invalid input." };
  }

  const { shape, color, clarity, weight, discount } = validatedFields.data;

  const caratPrice = findDiamondPrice(shape, color, clarity, weight);

  if (caratPrice === null) {
    return { success: false, error: "Price Not Available for the selected criteria." };
  }

  const basePrice = caratPrice * weight;
  const discountMultiplier = 1 - (discount / 100); // Corrected discount logic
  const discountedPricePerCarat = caratPrice * discountMultiplier;
  const finalAmount = weight * discountedPricePerCarat;

  const result: CalculationResult = {
    basePrice: parseFloat(basePrice.toFixed(2)),
    discountedPricePerCarat: parseFloat(discountedPricePerCarat.toFixed(2)),
    finalAmount: parseFloat(finalAmount.toFixed(2)),
    caratPrice: caratPrice,
  };

  return { success: true, data: result };
}

    