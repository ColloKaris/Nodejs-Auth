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
})

export type SignupInput = z.TypeOf<typeof createSignupSchema>['body'];
export type verifyEmailInput = z.TypeOf<typeof createVerifyEmailSchema>['body'];
export type verifyEmailParams = z.TypeOf<typeof createVerifyEmailSchema>['params'];