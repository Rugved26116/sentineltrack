import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getSafeErrorMessage } from '@/lib/errorHandler';
import { expenseSchema } from '@/lib/validationSchemas';

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string | null;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export function useExpenses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });
      
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!user,
  });

  const addExpense = useMutation({
    mutationFn: async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      // Validate input before sending to database
      const validatedExpense = expenseSchema.parse(expense);
      
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          amount: validatedExpense.amount,
          category: validatedExpense.category,
          description: validatedExpense.description || null,
          expense_date: validatedExpense.expense_date,
          user_id: user!.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense added!');
    },
    onError: (error: unknown) => {
      toast.error(getSafeErrorMessage(error, 'add'));
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted!');
    },
    onError: (error: unknown) => {
      toast.error(getSafeErrorMessage(error, 'delete'));
    },
  });

  return {
    expenses,
    isLoading,
    addExpense,
    deleteExpense,
  };
}
