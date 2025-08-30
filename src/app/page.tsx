"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import {
  getAllDiamonds,
  getUniqueClarities,
  getUniqueColors,
  getUniqueShapes,
} from '@/lib/diamond-data';
import { calculatePrice } from '@/lib/actions';
import type { CalculationResult } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  shape: z.string({ required_error: "Please select a shape." }),
  color: z.string({ required_error: "Please select a color." }),
  clarity: z.string({ required_error: "Please select a clarity." }),
  weight: z.coerce.number().positive({ message: "Weight must be positive." }),
  discount: z.coerce.number().min(-100).max(100).default(0),
});

type FormData = z.infer<typeof formSchema>;

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function Home() {
  const [shapes, setShapes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [clarities, setClarities] = useState<string[]>([]);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setShapes(getUniqueShapes());
    setColors(getUniqueColors());
    setClarities(getUniqueClarities());
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discount: 0,
    },
  });

  const { watch, control, handleSubmit } = form;
  const watchedValues = watch();

  useEffect(() => {
    const subscription = watch(async (values) => {
      const parsed = formSchema.safeParse(values);
      if (parsed.success) {
        const res = await calculatePrice(parsed.data);
        if (res.success) {
          setResult(res.data);
        } else {
          setResult(null);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, formSchema]);

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    const res = await calculatePrice(values);
    if (res.success) {
      setResult(res.data);
    } else {
      setResult(null);
      toast({
        variant: "destructive",
        title: "Calculation Error",
        description: res.error,
      })
    }
    setIsSubmitting(false);
  }

  const discountValue = watchedValues.discount || 0;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Shape</label>
                <Controller
                  name="shape"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Shape" /></SelectTrigger>
                        <SelectContent>
                          {shapes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Controller
                  name="color"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Color" /></SelectTrigger>
                      <SelectContent>
                        {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Clarity</label>
                 <Controller
                  name="clarity"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Clarity" /></SelectTrigger>
                      <SelectContent>
                        {clarities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="weight" className="text-sm font-medium">Weight</label>
              <Controller
                name="weight"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                  <Input id="weight" type="number" step="0.01" placeholder="e.g., 1.2" {...field} />
                  {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label htmlFor="discount" className="text-sm font-medium">Discount</label>
                 <Controller
                  name="discount"
                  control={control}
                  render={({ field, fieldState }) => (
                     <>
                      <div className="relative">
                        <Input
                          id="discount"
                          type="number"
                          placeholder="e.g., -15"
                          {...field}
                          className={`pr-8 ${discountValue < 0 ? 'text-destructive' : ''}`}
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">%</span>
                      </div>
                       {fieldState.error && <p className="text-xs text-destructive">{fieldState.error.message}</p>}
                     </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rap Price</label>
                <Input readOnly value={formatCurrency(result?.caratPrice)} className="bg-muted font-semibold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Per Carat</label>
              <Input readOnly value={formatCurrency(result?.discountedPricePerCarat)} className="bg-muted font-semibold"/>
            </div>
            
            <div className="bg-primary text-primary-foreground rounded-md p-3 flex items-center justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-extrabold text-xl">{formatCurrency(result?.finalAmount)}</span>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
