import express from 'express';

import { wrapAsync } from '../utils/wrapAsync.js';
import { forgotPassword, loginHandler, logoutHandler, resetPassword, signupHandler, verifyEmailHandler } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validateResource.js';
import { createLoginSchema, createSignupSchema, createVerifyEmailSchema, forgotPasswordSchema, resetPasswordSchema } from '../schema/user.schema.js';

export const authRouter = express.Router({mergeParams: true});

authRouter.post('/signup', validate(createSignupSchema) ,wrapAsync(signupHandler));

authRouter.post('/login', validate(createLoginSchema), wrapAsync(loginHandler));

authRouter.post('/logout', logoutHandler);

authRouter.post('/verify-email/:id', validate(createVerifyEmailSchema), wrapAsync(verifyEmailHandler))

authRouter.post('/forgot-password', validate(forgotPasswordSchema) ,wrapAsync(forgotPassword));

authRouter.post('/reset-password/:resetCode', validate(resetPasswordSchema), wrapAsync(resetPassword));