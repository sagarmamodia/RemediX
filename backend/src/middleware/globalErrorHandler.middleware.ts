import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const globalErrorHandler = (
  err: AppError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Send JSON response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // stack: err.stack // Optional: Only show stack in development
  });
};