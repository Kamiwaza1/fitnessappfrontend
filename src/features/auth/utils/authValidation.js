const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginValues({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const fieldErrors = {};

  if (!normalizedEmail) {
    fieldErrors.email = "Email is required";
  } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
    fieldErrors.email = "Please provide a valid email address";
  }

  if (!password) {
    fieldErrors.password = "Password is required";
  }

  return {
    normalizedEmail,
    fieldErrors,
  };
}

export function validateRegisterValues({ fullName, email, password }) {
  const normalizedName = fullName.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const fieldErrors = {};

  if (!normalizedName) {
    fieldErrors.fullName = "Full name is required";
  } else if (normalizedName.length < 2 || normalizedName.length > 100) {
    fieldErrors.fullName = "Full name must be between 2 and 100 characters";
  }

  if (!normalizedEmail) {
    fieldErrors.email = "Email is required";
  } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
    fieldErrors.email = "Please provide a valid email address";
  }

  if (!password) {
    fieldErrors.password = "Password is required";
  } else if (password.length < 12 || password.length > 128) {
    fieldErrors.password = "Password must be between 12 and 128 characters";
  }

  return {
    normalizedName,
    normalizedEmail,
    fieldErrors,
  };
}
