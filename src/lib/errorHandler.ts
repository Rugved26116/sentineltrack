/**
 * Maps database and API errors to safe, user-friendly messages.
 * This prevents leaking internal details like table names, column names, or schema info.
 */
export function getSafeErrorMessage(error: unknown, context?: string): string {
  // Default fallback messages based on context
  const fallbackMessages: Record<string, string> = {
    add: 'Unable to save. Please try again.',
    update: 'Unable to update. Please try again.',
    delete: 'Unable to delete. Please try again.',
    auth: 'Authentication failed. Please check your credentials.',
    fetch: 'Unable to load data. Please try again.',
    default: 'Something went wrong. Please try again.',
  };

  // Get the base message for the context
  const baseMessage = fallbackMessages[context || 'default'] || fallbackMessages.default;

  if (!error) {
    return baseMessage;
  }

  // Extract error message safely
  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Map known safe error patterns to user-friendly messages
  if (lowerMessage.includes('invalid login credentials') || 
      lowerMessage.includes('invalid email or password')) {
    return 'Invalid email or password.';
  }

  if (lowerMessage.includes('email already registered') ||
      lowerMessage.includes('user already registered')) {
    return 'An account with this email already exists.';
  }

  if (lowerMessage.includes('password') && lowerMessage.includes('weak')) {
    return 'Password is too weak. Please use a stronger password.';
  }

  if (lowerMessage.includes('email') && 
      (lowerMessage.includes('invalid') || lowerMessage.includes('format'))) {
    return 'Please enter a valid email address.';
  }

  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }

  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('permission')) {
    return 'You don\'t have permission to perform this action.';
  }

  if (lowerMessage.includes('not found')) {
    return 'The requested item was not found.';
  }

  if (lowerMessage.includes('duplicate') || lowerMessage.includes('already exists')) {
    return 'This item already exists.';
  }

  if (lowerMessage.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // For any unrecognized errors, return the safe context-based message
  // This prevents leaking table names, column names, or internal details
  return baseMessage;
}
