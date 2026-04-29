export function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten(),
      });
    }

    // Important: use Zod-coerced values in controllers/services.
    // Without this, HTML form values arrive as strings and Prisma rejects Int/Decimal fields.
    req.validated = result.data;
    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) req.query = result.data.query;

    next();
  };
}
