import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface AcademicTask {
  id: string;
  user_id: string;
  subject: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useAcademicTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['academic_tasks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('academic_tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AcademicTask[];
    },
    enabled: !!user,
  });

  const addTask = useMutation({
    mutationFn: async (task: Omit<AcademicTask, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
      const { data, error } = await supabase
        .from('academic_tasks')
        .insert({ ...task, user_id: user!.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic_tasks'] });
      toast.success('Task added!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AcademicTask> & { id: string }) => {
      const { data, error } = await supabase
        .from('academic_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic_tasks'] });
      toast.success('Task updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('academic_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic_tasks'] });
      toast.success('Task deleted!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
  };
}
