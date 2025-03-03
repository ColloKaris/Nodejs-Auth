import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ExpressError } from '../utils/ExpressError.js';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    // using safeParse instead of parse so that we can overwrite the req.body
    // .parse() does not mutate the original req object. This means that even though
    // Zod applies default values when validatin the schema, req.body won't be updated
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
    });

    if (!result.success) {
      const error = new ExpressError(result.error.errors[0].message, 403);
      next(error);
      return;
    }

    //overwrite req.body with the parsed (default-filled) data so the default
    // values are retained in the request
    req.body = result.data.body;
    next();
  };
