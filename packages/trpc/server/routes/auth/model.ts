import { z } from "zod";
import { passwordSchema } from "@repo/services/user/model";

export const createUserWithEmailAndPasswordInputModel = z.object({
  fullName: z.string().describe("Full Name of the user"),
  email: z.email().describe("Email of the user"),
  password: passwordSchema,
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("Id of the user"),
});
