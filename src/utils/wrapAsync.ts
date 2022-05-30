import { Request, Response, NextFunction, RequestHandler } from 'express';

export const wrapAsync = (
  fn: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>
): RequestHandler => (req, res, next) =>
  fn(req, res, next).catch(next);
