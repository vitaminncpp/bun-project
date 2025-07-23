import type { Context, Next } from "hono";
import ErrorResponse from "../models/ErrorResponse.model";

export async function validateGetUser(c: Context, next: Next) {
  const errors: { [key: string]: { [key: string]: string } } = {};
  if (!c.req.param("id")) {
    errors["user_id"] = { required: "field `user_id` is required" };
  }
  if (Object.entries(errors).length > 0) {
    return c.json(
      new ErrorResponse(400, "Validation(s) failed", new Error(), errors),
      400
    );
  }
  await next();
}

export async function validateAddUsers(c: Context, next: Next) {
  const body = await c.req.json().catch(() => null);
  if (!Array.isArray(body) || body.length === 0) {
    return c.json(
      new ErrorResponse(
        400,
        "Request Body must be a non-empty array of objects",
        new Error()
      ),
      400
    );
  }
  const errors: Array<{ index: number; errors: { [key: string]: string } }> =
    [];
  body.forEach((item, idx) => {
    const itemErrors: { [key: string]: string } = {};
    if (!item || typeof item !== "object") {
      errors.push({
        index: idx,
        errors: { object: "Each item must be an object" },
      });
      return;
    }
    if (!item.username || typeof item.username !== "string") {
      itemErrors["username"] =
        "field `username` is required and must be a string";
    }
    if (!item.name || typeof item.name !== "string") {
      itemErrors["name"] = "field `name` is required and must be a string";
    }
    if (!item.password || typeof item.password !== "string") {
      itemErrors["password"] =
        "field `password` is required and must be a string";
    }
    if (Object.keys(itemErrors).length > 0) {
      errors.push({ index: idx, errors: itemErrors });
    }
  });
  if (errors.length > 0) {
    return c.json(
      new ErrorResponse(400, "Validation(s) failed", new Error(), errors),
      400
    );
  }
  c.set("body", body);
  await next();
}
