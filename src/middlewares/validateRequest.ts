import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { BadRequestError } from "../utils/errors";

export const validateRequest = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error.issues) {
        const formattedErrors = error.issues.map((issue: any) => {
          return `${issue.path.join(".")}: ${issue.message}`;
        });
        next(new BadRequestError(formattedErrors.join(", ")));
      } else {
        next(error);
      }
    }
  };
};
