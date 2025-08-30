
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


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
      shape: "",
      color: "",
      clarity: "",
      weight: 0,
      discount: 0,
    },
  });

  const { watch, handleSubmit, control } = form;
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
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Diamond Price Calculator</CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name="shape"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shape</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Shape" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shapes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                         <FormControl>
                          <SelectTrigger><SelectValue placeholder="Color" /></SelectTrigger>
                         </FormControl>
                        <SelectContent>
                          {colors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="clarity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clarity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Clarity" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clarities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (ct.)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 1.2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={control}
                  name="discount"
                  render={({ field }) => (
                     <FormItem>
                       <FormLabel>Discount</FormLabel>
                       <FormControl>
                         <div className="relative">
                          <Input
                            type="number"
                            placeholder="e.g., -15"
                            {...field}
                            className={`pr-8 ${discountValue < 0 ? 'text-destructive' : ''}`}
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">%</span>
                         </div>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                  )}
                />
                <div className="space-y-2">
                  <FormLabel>Rap Price</FormLabel>
                  <Input readOnly value={formatCurrency(result?.caratPrice)} className="bg-muted font-semibold" />
                </div>
              </div>

              <div className="space-y-2">
                <FormLabel>Price Per Carat</FormLabel>
                <Input readOnly value={formatCurrency(result?.discountedPricePerCarat)} className="bg-muted font-semibold"/>
              </div>

              <div className="bg-primary text-primary-foreground rounded-lg p-4 flex items-center justify-between">
                  <span className="font-bold text-lg">Total Price</span>
                  <span className="font-extrabold text-2xl">{formatCurrency(result?.finalAmount)}</span>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  'Calculate'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
