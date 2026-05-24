import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
  )
  .describe("Password of the user");

export const createUserWithEmailAndPasswordInput = z.object({
  fullName: z.string().describe('Full Name of the user'),
  email: z.email().describe("Email of the user"),
  password: passwordSchema,
});

export type CreateUserWithEmailAndPasswordInputType = z.infer<typeof createUserWithEmailAndPasswordInput>;