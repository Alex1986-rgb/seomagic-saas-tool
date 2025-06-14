
import * as z from "zod";

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" }),
});

// Registration validation schema
export const registerSchema = z.object({
  fullName: z.string().min(2, "Имя должно содержать минимум 2 символа").optional(),
  email: z.string().email({ message: "Введите корректный email" }),
  password: z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" }),
  confirmPassword: z.string().min(6, { message: "Пароль должен содержать минимум 6 символов" }),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Необходимо принять условия использования",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

// Define types for form values
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
