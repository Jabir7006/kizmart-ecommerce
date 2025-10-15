// middlewares/validate.js
import { ZodError } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      const result = schema.body.safeParse(req.body);
      if (!result.success) throw result.error; // ✅ throw actual ZodError
      req.validated = { ...req.validated, body: result.data };
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params);
      if (!result.success) throw result.error;
      req.validated = { ...req.validated, params: result.data };
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.query);
      if (!result.success) throw result.error;
      req.validated = { ...req.validated, query: result.data };
    }

    next();
  } catch (err) {
    next(err); // pass to global error handler
  }
};
