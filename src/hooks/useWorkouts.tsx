import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { getSafeErrorMessage } from '@/lib/errorHandler';
import { workoutSchema } from '@/lib/validationSchemas';

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_name: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  notes: string | null;
  order_index: number;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  name: string;
  workout_date: string;
  duration_minutes: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  exercises?: WorkoutExercise[];
}

export function useWorkouts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: workouts = [], isLoading } = useQuery({
    queryKey: ['workouts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select(`
          *,
          exercises:workout_exercises(*)
        `)
        .order('workout_date', { ascending: false });
      
      if (error) throw error;
      return data as Workout[];
    },
    enabled: !!user,
  });

  const addWorkout = useMutation({
    mutationFn: async (workout: { 
      name: string; 
      workout_date: string; 
      duration_minutes?: number; 
      notes?: string;
      exercises?: Omit<WorkoutExercise, 'id' | 'workout_id' | 'created_at'>[];
    }) => {
      // Validate input before sending to database
      const validatedWorkout = workoutSchema.parse(workout);
      const { exercises, ...workoutData } = validatedWorkout;
      
      const { data: newWorkout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          name: workoutData.name,
          workout_date: workoutData.workout_date,
          duration_minutes: workoutData.duration_minutes || null,
          notes: workoutData.notes || null,
          user_id: user!.id
        })
        .select()
        .single();
      
      if (workoutError) throw workoutError;

      if (exercises && exercises.length > 0) {
        const { error: exercisesError } = await supabase
          .from('workout_exercises')
          .insert(exercises.map(ex => ({
            exercise_name: ex.exercise_name,
            sets: ex.sets || null,
            reps: ex.reps || null,
            weight: ex.weight || null,
            notes: ex.notes || null,
            order_index: ex.order_index || 0,
            workout_id: newWorkout.id
          })));
        
        if (exercisesError) throw exercisesError;
      }

      return newWorkout;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast.success('Workout logged!');
    },
    onError: (error: unknown) => {
      toast.error(getSafeErrorMessage(error, 'add'));
    },
  });

  const deleteWorkout = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast.success('Workout deleted!');
    },
    onError: (error: unknown) => {
      toast.error(getSafeErrorMessage(error, 'delete'));
    },
  });

  return {
    workouts,
    isLoading,
    addWorkout,
    deleteWorkout,
  };
}
