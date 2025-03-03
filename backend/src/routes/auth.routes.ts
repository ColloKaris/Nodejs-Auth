import express from 'express';

import { wrapAsync } from '../utils/wrapAsync.js';
import { loginHandler, logoutHandler, signupHandler } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validateResource.js';
import { createSignupSchema } from '../schema/user.schema.js';

export const authRouter = express.Router({mergeParams: true});

authRouter.post('/signup', validate(createSignupSchema) ,wrapAsync(signupHandler));

authRouter.post('/login', wrapAsync(loginHandler));

authRouter.post('/logout', wrapAsync(logoutHandler));
