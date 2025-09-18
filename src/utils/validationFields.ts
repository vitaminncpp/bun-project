type ValidationErrors = Record<string, Record<string, string>>;

export function validateObjectFields(
  body: any,
  requiredFields: string[],
): { valid: boolean; errors?: ValidationErrors } {
  const errors: ValidationErrors = {};

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      valid: false,
      errors: { body: { type: "Request body must be an object" } },
    };
  }

  for (const field of requiredFields) {
    if (!body[field] || typeof body[field] !== "string") {
      errors[field] = {
        required: `field \`${field}\` is required and must be a string`,
      };
    }
  }

  return Object.keys(errors).length > 0
    ? { valid: false, errors }
    : { valid: true };
}
