# Node.js Advanced Auth
![Welcome Email](https://res.cloudinary.com/dvmtn1i7u/image/upload/v1741165566/Screenshot_from_2025-03-03_19-13-32_j2xrao.png)
This is Node.js RESTful API to handle authentication. It supports email verification, welcome emails, password resets, and authentication using json web token and http-only cookies for enhanced security.

With the API, a user creates an account after which they receive an email requiring them verify their email address. Users can also reset their password when they forget.

The API uses Zod for input validation preventing submission of invalid data and guaranteeing the type of data that's handled by the the application. MongoDB Json Schema Validation is also utilized to add extra layer for data validation guaranteering the type of data that's stored in the database. Passwords are hashed before storage using Argon2. Emails are sent using Mailtrap.

## Tech Stack
- **Backend**: Node.js, TypeScript, Express
- **Database**: MongoDB
- **Authentication** - Json Web Tokens
- **Password Hashing** - Argon2
- **Emails** - Mailtrap by railsware

## Screenshots
### Welcome email after creating an Account
This is a welcome email sent after users signup on the application
![Welcome Email](https://res.cloudinary.com/dvmtn1i7u/image/upload/v1741165566/Screenshot_from_2025-03-03_19-13-32_j2xrao.png)

### Verification Email
This email is sent after users create an account.
![Verify Email](https://res.cloudinary.com/dvmtn1i7u/image/upload/v1741165566/Screenshot_from_2025-03-03_17-56-03_ksu4ce.png)

### Forgot Password - Password Reset Email
This email is sent after a user clicks on Forgot Password.
![Reset Password Email](https://res.cloudinary.com/dvmtn1i7u/image/upload/v1741165565/Screenshot_from_2025-03-04_21-11-55_kd8bl7.png)

### Successful Password Reset Email
This email is sent after a user successfully resets their passwords after clicking on forgot password and being required to provide a new password.
![Successful Password Reset](https://res.cloudinary.com/dvmtn1i7u/image/upload/v1741165565/Screenshot_from_2025-03-05_09-39-54_ezwf5u.png)
