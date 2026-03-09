import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const validationErrors = result.error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation errors",
        error: "Invalid request payload",
        validationErrors,
      });
    }

    req.body = result.data;
    next();
  };
};
