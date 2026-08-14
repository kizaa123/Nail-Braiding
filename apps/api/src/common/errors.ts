export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

export const Errors = {
  unauthorized: (message = 'Authentication required') =>
    new AppError('UNAUTHORIZED', message, 401),
  forbidden: (message = 'You do not have permission to perform this action') =>
    new AppError('FORBIDDEN', message, 403),
  notFound: (entity = 'Resource') => new AppError('NOT_FOUND', `${entity} not found`, 404),
  conflict: (message: string) => new AppError('CONFLICT', message, 409),
  validation: (message: string, details?: Record<string, unknown>) =>
    new AppError('VALIDATION_ERROR', message, 400, details),
  rateLimited: () => new AppError('RATE_LIMITED', 'Too many requests. Please try again later.', 429),
  unavailable: (message: string) => new AppError('UNAVAILABLE', message, 503),
};
