import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    return res.status(400).json({ 
      ...err,
      message: err.message
    });
};