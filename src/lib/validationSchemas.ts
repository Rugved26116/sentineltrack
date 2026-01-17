import { z } from 'zod';

// Maximum lengths for text fields
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_CONTENT_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;
const MAX_NOTES_LENGTH = 1000;
const MAX_CATEGORY_LENGTH = 50;
const MAX_SUBJECT_LENGTH = 100;
const MAX_EXERCISE_NAME_LENGTH = 100;

// Text sanitization helper - basic XSS prevention
const sanitizeString = (str: string) => str.trim();

// Academic Task Schemas
export const academicTaskSchema = z.object({
  subject: z.string()
    .transform(sanitizeString)
    .pipe(z.string().min(1, 'Subject is required').max(MAX_SUBJECT_LENGTH, `Subject must be less than ${MAX_SUBJECT_LENGTH} characters`)),
  title: z.string()
    .transform(sanitizeString)
    .pipe(z.string().min(1, 'Title is required').max(MAX_TITLE_LENGTH, `Title must be less than ${MAX_TITLE_LENGTH} characters`)),
  description: z.string()
    .transform(sanitizeString)
    .pipe(z.string().max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`))
    .nullable()
    .optional(),
  status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  due_date: z.string().nullable().optional(),
});

export const academicTaskUpdateSchema = academicTaskSchema.partial();

// Expense Schemas
export const expenseSchema = z.object({
  amount: z.number()
    .positive('Amount must be greater than 0')
    .max(999999999, 'Amount is too large'),
  category: z.string()
    .transform(sanitizeString)
    .pipe(z.string().min(1, 'Category is required').max(MAX_CATEGORY_LENGTH, `Category must be less than ${MAX_CATEGORY_LENGTH} characters`)),
  description: z.string()
    .transform(sanitizeString)
    .pipe(z.string().max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`))
    .nullable()
    .optional(),
  expense_date: z.string().min(1, 'Date is required'),
});

// Reflection Schemas
export const reflectionSchema = z.object({
  content: z.string()
    .transform(sanitizeString)
    .pipe(z.string().min(1, 'Content is required').max(MAX_CONTENT_LENGTH, `Content must be less than ${MAX_CONTENT_LENGTH} characters`)),
  mood: z.enum(['great', 'good', 'neutral', 'bad', 'terrible']).nullable().optional(),
  reflection_date: z.string().min(1, 'Date is required'),
});

export const reflectionUpdateSchema = reflectionSchema.partial();

// Workout Schemas
export const workoutExerciseSchema = z.object({
  exercise_name: z.string()
    .transform(sanitizeString)
    .pipe(z.string().min(1, 'Exercise name is required').max(MAX_EXERCISE_NAME_LENGTH, `Exercise name must be less than ${MAX_EXERCISE_NAME_LENGTH} characters`)),
  sets: z.number().int().positive().max(100).nullable().optional(),
  reps: z.number().int().positive().max(1000).nullable().optional(),
  weight: z.number().positive().max(10000).nullable().optional(),
  notes: z.string()
    .transform(sanitizeString)
    .pipe(z.string().max(MAX_NOTES_LENGTH, `Notes must be less than ${MAX_NOTES_LENGTH} characters`))
    .nullable()
    .optional(),
  order_index: z.number().int().min(0).default(0),
});

export const workoutSchema = z.object({
  name: z.string()
    .transform(sanitizeString)
    .pipe(z.string().min(1, 'Workout name is required').max(MAX_NAME_LENGTH, `Name must be less than ${MAX_NAME_LENGTH} characters`)),
  workout_date: z.string().min(1, 'Date is required'),
  duration_minutes: z.number().int().positive().max(1440).nullable().optional(), // Max 24 hours
  notes: z.string()
    .transform(sanitizeString)
    .pipe(z.string().max(MAX_NOTES_LENGTH, `Notes must be less than ${MAX_NOTES_LENGTH} characters`))
    .nullable()
    .optional(),
  exercises: z.array(workoutExerciseSchema).optional(),
});

// Auth Schemas
export const authSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must be less than 72 characters'), // bcrypt limit
});

// Type exports
export type AcademicTaskInput = z.infer<typeof academicTaskSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
export type ReflectionInput = z.infer<typeof reflectionSchema>;
export type WorkoutInput = z.infer<typeof workoutSchema>;
export type AuthInput = z.infer<typeof authSchema>;
