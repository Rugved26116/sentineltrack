import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getSafeErrorMessage } from '@/lib/errorHandler';
import { academicTaskSchema, academicTaskUpdateSchema } from '@/lib/validationSchemas';

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
      // Validate input before sending to database
      const validatedTask = academicTaskSchema.parse(task);
      
      const { data, error } = await supabase
        .from('academic_tasks')
        .insert({ 
          subject: validatedTask.subject,
          title: validatedTask.title,
          description: validatedTask.description || null,
          status: validatedTask.status,
          priority: validatedTask.priority,
          due_date: validatedTask.due_date || null,
          user_id: user!.id 
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academic_tasks'] });
      toast.success('Task added!');
    },
    onError: (error: unknown) => {
      toast.error(getSafeErrorMessage(error, 'add'));
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AcademicTask> & { id: string }) => {
      // Validate update input
      const validatedUpdates = academicTaskUpdateSchema.parse(updates);
      
      const { data, error } = await supabase
        .from('academic_tasks')
        .update(validatedUpdates)
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
    onError: (error: unknown) => {
      toast.error(getSafeErrorMessage(error, 'update'));
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
    onError: (error: unknown) => {
      toast.error(getSafeErrorMessage(error, 'delete'));
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
