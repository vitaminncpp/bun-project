// import type { Context } from "hono";
// import * as roleService from "../services/role.service";
// import SuccessResponse from "../models/SuccessResponse.model";
// import { Role as RoleModel } from "../models/Role.model";

// export async function getAllRoles(c: Context) {
//   let options = undefined;
//   const page = c.req.query("page");
//   const size = c.req.query("size");
//   if (page && size) {
//     options = {
//       page: Number(page),
//       size: Number(size),
//     };
//   }
//   const roles = await roleService.getAllRoles(options);
//   return c.json(new SuccessResponse(200, "All users fetched successfully", roles), 200);
// }

// export async function getRole(c: Context) {
//   const roleId = c.req.param("id");
//   const role = await roleService.getRole(roleId);
//   return c.json(new SuccessResponse(200, "All users fetched successfully", role), 200);
// }

// export async function createRole(c: Context) {
//   const body = await c.req.json();
//   const role: RoleModel = await roleService.createRole(body.rolename, body.description);
//   return c.json(new SuccessResponse(200, "All users fetched successfully", role), 200);
// }

// export function updateRole(c: Context) {
//   // Implement update logic here
//   return c.json({ message: "Not implemented" }, 200);
// }

// export function deleteRole(c: Context) {
//   // Implement delete logic here
//   return c.json({ message: "Not implemented" }, 200);
// }
