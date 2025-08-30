
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Trash2 } from 'lucide-react';
import {
  getAllDiamonds,
  getUniqueClarities,
  getUniqueColors,
  getUniqueShapes,
} from '@/lib/diamond-data';
import { calculatePrice } from '@/lib/actions';
import type { CalculationResult, HistoryItem, CalculationInput } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Separator } from '@/components/ui/separator';


const formSchema = z.object({
  shape: z.string({ required_error: "Please select a shape." }).min(1, "Please select a shape."),
  color: z.string({ required_error: "Please select a color." }).min(1, "Please select a color."),
  clarity: z.string({ required_error: "Please select a clarity." }).min(1, "Please select a clarity."),
  weight: z.coerce.number().positive({ message: "Weight must be positive." }),
  discount: z.coerce.number().min(-100).max(100).default(0),
});

type FormData = z.infer<typeof formSchema>;

const formatCurrency = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null) return '';
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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setShapes(getUniqueShapes());
    setColors(getUniqueColors());
    setClarities(getUniqueClarities());

    const storedHistory = localStorage.getItem('diamond-calc-history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shape: "",
      color: "",
      clarity: "",
      weight: undefined, // Set to undefined to avoid controlled/uncontrolled error
      discount: 0,
    },
  });

  const { watch, handleSubmit, control } = form;
  const watchedValues = watch();

  const updatePrice = async (values: FormData) => {
    const parsed = formSchema.safeParse(values);
    if (parsed.success) {
      const res = await calculatePrice(parsed.data);
      if (res.success) {
        setResult(res.data);
      } else {
        setResult(null);
      }
    }
  };

  useEffect(() => {
    const subscription = watch((values) => {
      updatePrice(values as FormData);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const addToHistory = (input: CalculationInput, result: CalculationResult) => {
    const newHistoryItem: HistoryItem = {
      id: new Date().toISOString(),
      input,
      result,
      timestamp: new Date().toLocaleString(),
    };
    const updatedHistory = [newHistoryItem, ...history].slice(0, 10); // Limit history
    setHistory(updatedHistory);
    localStorage.setItem('diamond-calc-history', JSON.stringify(updatedHistory));
  };
  
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('diamond-calc-history');
    toast({
      title: "History Cleared",
      description: "Your calculation history has been successfully cleared.",
    });
  };

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    const res = await calculatePrice(values);
    if (res.success) {
      setResult(res.data);
      addToHistory(values, res.data);
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
    <main className="flex min-h-screen flex-col items-center justify-start bg-background p-4 sm:p-6 md:p-8 space-y-8">
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
                      <Select onValueChange={field.onChange} value={field.value} >
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Input type="number" step="0.01" placeholder="e.g., 1.2" {...field} value={field.value ?? ''}/>
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
                            value={field.value ?? ''}
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
                  'Calculate & Add to History'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {history.length > 0 && (
         <Card className="w-full max-w-4xl shadow-2xl">
           <CardHeader className="flex flex-row items-center justify-between">
             <CardTitle className="text-2xl font-bold">Calculation History</CardTitle>
             <Button variant="ghost" size="icon" onClick={clearHistory}>
                <Trash2 className="h-5 w-5 text-destructive"/>
                <span className="sr-only">Clear History</span>
             </Button>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
              {history.map((item, index) => (
                <React.Fragment key={item.id}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                      <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Specs</p>
                          <p className="font-semibold">{item.input.shape} {item.input.weight}ct {item.input.color} {item.input.clarity}</p>
                      </div>
                       <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Discount</p>
                          <p className={`font-semibold ${item.input.discount < 0 ? 'text-destructive' : ''}`}>{item.input.discount}%</p>
                      </div>
                      <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Price/Carat</p>
                          <p className="font-semibold">{formatCurrency(item.result.discountedPricePerCarat)}</p>
                      </div>
                      <div className="space-y-1 text-right">
                          <p className="text-sm font-medium text-muted-foreground">Total Price</p>
                          <p className="text-xl font-bold text-primary-foreground">{formatCurrency(item.result.finalAmount)}</p>
                      </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                  {index < history.length - 1 && <Separator />}
                </React.Fragment>
              ))}
             </div>
           </CardContent>
         </Card>
       )}
    </main>
  );
}

    