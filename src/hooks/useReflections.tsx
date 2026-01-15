import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Reflection {
  id: string;
  user_id: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible' | null;
  reflection_date: string;
  created_at: string;
  updated_at: string;
}

export function useReflections() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reflections = [], isLoading } = useQuery({
    queryKey: ['reflections', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .order('reflection_date', { ascending: false });
      
      if (error) throw error;
      return data as Reflection[];
    },
    enabled: !!user,
  });

  const addReflection = useMutation({
    mutationFn: async (reflection: Omit<Reflection, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('reflections')
        .insert({ ...reflection, user_id: user!.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      toast.success('Reflection saved!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateReflection = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Reflection> & { id: string }) => {
      const { data, error } = await supabase
        .from('reflections')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      toast.success('Reflection updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteReflection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reflections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      toast.success('Reflection deleted!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    reflections,
    isLoading,
    addReflection,
    updateReflection,
    deleteReflection,
  };
}
