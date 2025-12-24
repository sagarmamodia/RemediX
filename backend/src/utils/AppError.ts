import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync = (fn: Function) => {

  // 2. It returns a NEW anonymous function that Express will actually call
  return (req: Request, res: Response, next: NextFunction) => {
    
    // 3. It calls your function. Since your function is 'async', it returns a Promise.
    // 4. We attach .catch(next) to that Promise.
    fn(req, res, next).catch(next);
  };
};