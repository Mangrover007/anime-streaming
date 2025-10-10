export const validatePayload = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // This line is CORRECT. It accesses the internal property 'issues'
    // on the ZodError object ('result.error').
    const errors = result.error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors
    });
  }

  req.body = result.data;
  next();
};
