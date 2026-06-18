# Password Reset Frontend

The password reset UI is implemented with the existing auth feature structure.

## Routes

- `/forgot-password`
- `/reset-password?token=...`

## API Calls

`requestPasswordReset` calls:

```text
POST /api/v1/auth/forgot-password
```

`resetPassword` calls:

```text
POST /api/v1/auth/reset-password
```

The reset token is read from the email URL. The user also types the 6-digit security code from the email.

The reset page works in two steps:

1. Enter the 6-digit security code.
2. Enter and confirm the new password.

The final request submits token, code, and password in the JSON body:

```json
{
  "token": "...",
  "code": "123456",
  "newPassword": "NewStrongPassword123!"
}
```

## Environment

The frontend continues to use:

```bash
NEXT_PUBLIC_API_BASE_URL="http://localhost:8080"
```

The backend email link target is controlled by:

```bash
APP_FRONTEND_URL="http://localhost:3000"
```

For production:

```bash
APP_FRONTEND_URL="https://darklift.app"
```
