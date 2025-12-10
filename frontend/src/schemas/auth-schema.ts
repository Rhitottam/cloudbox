import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export const signupFormSchema = loginFormSchema.extend({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters long" }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Both passwords must match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type SignupFormData = z.infer<typeof signupFormSchema>;