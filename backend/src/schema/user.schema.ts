import { z } from 'zod';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789', 6)

// always use default(() => new Date()) for timestamps in Zod. 
export const createSignupSchema = z.object({
  body: z.object({
    email: z.string({required_error: 'Email is required'}).email('Invalid Email'),
    password: z.string({required_error: 'Password is required'}).min(6, 'Password is too short. Needs at least 6 characters'),
    name: z.string({required_error: 'Name is required'}),
    lastLogin: z.date().default(() => new Date()),
    isVerified: z.boolean().default(false),
    verificationCode: z.string().default(() => nanoid(6)), // using a function ensures a code is generated only when user is created
    verificationCodeExpiresAt: z.date().default(() => new Date(Date.now() + 24 * 60 * 60 * 1000)),
    resetPasswordCode: z.string().nullable().default(null),
    resetPasswordCodeExpiresAt: z.date().nullable().default(null)
  })
});

export const createVerifyEmailSchema = z.object({
  body: z.object({
    code: z.string({required_error: 'Verification code is required'})
  }),
  params: z.object({
    id: z.string({required_error: 'Id property is required'})
  })
});

export const createLoginSchema = z.object({
  body: z.object({
    email: z.string({required_error: 'Email is required'}).email('Invalid email address'),
    password: z.string({required_error: 'Passsword is required'}).min(6, 'Password is too short')
  })
})

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string({required_error: 'Email is required'}).email('Invalid email address')
  })
})

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string({required_error: 'Password is required'}).min(6, 'Password is too short')
  }),
  params: z.object({
    resetCode: z.string({required_error: 'Resetcode is required'})
  })
})

export type SignupInput = z.infer<typeof createSignupSchema>['body'];
export type verifyEmailInput = z.infer<typeof createVerifyEmailSchema>['body'];
export type verifyEmailParams = z.infer<typeof createVerifyEmailSchema>['params'];
export type LoginInput = z.infer<typeof createLoginSchema>['body'];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];

export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>['params'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
