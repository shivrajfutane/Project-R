/**
 * Input validation utilities tailored for AWS Cognito requirements
 */

// Email regex according to RFC standard requiring domain dot-extension
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email.trim());
};

// Indian Phone number validator (10 digits, starts with 6, 7, 8, or 9)
export const isValidIndianPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  // Clean non-digits
  const digits = phone.replace(/\D/g, '');
  // Match either 10 digits starting with 6-9, or 12 digits starting with 91 followed by 6-9
  if (digits.length === 10) {
    return /^[6-9]\d{9}$/.test(digits);
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return /^91[6-9]\d{9}$/.test(digits);
  }
  return false;
};

// Format phone number to E.164 standard for AWS Cognito (+91XXXXXXXXXX)
export const formatPhoneToE164 = (phone) => {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  return phone.startsWith('+') ? phone : `+${digits}`;
};

/**
 * Calculates password strength against AWS Cognito policy:
 * - Minimum 8 characters
 * - At least 1 lowercase letter
 * - At least 1 uppercase letter
 * - At least 1 number
 * - At least 1 special character (@$!%*?&#^_- etc.)
 */
export const checkPasswordStrength = (password) => {
  const checks = {
    minLength: (password || '').length >= 8,
    hasLower: /[a-z]/.test(password || ''),
    hasUpper: /[A-Z]/.test(password || ''),
    hasNumber: /\d/.test(password || ''),
    hasSpecial: /[^A-Za-z0-9]/.test(password || ''),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let label = 'Very Weak';
  let color = 'bg-red-500';
  let percentage = 20;

  if (score === 5) {
    label = 'Strong';
    color = 'bg-emerald-500';
    percentage = 100;
  } else if (score >= 4) {
    label = 'Good';
    color = 'bg-teal-500';
    percentage = 80;
  } else if (score >= 3) {
    label = 'Moderate';
    color = 'bg-amber-500';
    percentage = 60;
  } else if (score >= 2) {
    label = 'Weak';
    color = 'bg-orange-500';
    percentage = 40;
  }

  return {
    score,
    maxScore: 5,
    percentage,
    label,
    color,
    checks,
    isValid: checks.minLength && checks.hasLower && checks.hasUpper && checks.hasNumber && checks.hasSpecial,
  };
};

/**
 * Validates Login inputs
 */
export const validateLoginForm = (type, values) => {
  const errors = {};

  if (type === 'phone') {
    if (!values.phone || !values.phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (!isValidIndianPhone(values.phone)) {
      errors.phone = 'Enter a valid 10-digit Indian mobile number (e.g., 9876543210)';
    }
  } else {
    // Email login
    if (!values.email || !values.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates Buyer Registration Form
 */
export const validateBuyerSignup = (values) => {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = 'Full name is required';
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (values.phone && !isValidIndianPhone(values.phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number';
  }

  const pwStrength = checkPasswordStrength(values.password);
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (!pwStrength.isValid) {
    errors.password = 'Password must meet all complexity requirements';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!values.agreeTerms) {
    errors.agreeTerms = 'You must accept the Terms and Conditions to proceed';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates Seller Registration Form
 */
export const validateSellerSignup = (values) => {
  const errors = {};

  if (!values.name || !values.name.trim()) {
    errors.name = 'Full name is required';
  }

  if (!values.email || !values.email.trim()) {
    errors.email = 'Business email address is required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.phone || !values.phone.trim()) {
    errors.phone = 'Contact phone number is required';
  } else if (!isValidIndianPhone(values.phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number';
  }

  if (!values.storeName || !values.storeName.trim()) {
    errors.storeName = 'Store / Business name is required';
  } else if (values.storeName.trim().length < 3) {
    errors.storeName = 'Store name must be at least 3 characters';
  }

  if (!values.category) {
    errors.category = 'Please select a primary business category';
  }

  // GST format check (optional but validated if entered: 15 alphanumeric chars)
  if (values.gstNumber && values.gstNumber.trim()) {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(values.gstNumber.trim().toUpperCase())) {
      errors.gstNumber = 'Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)';
    }
  }

  const pwStrength = checkPasswordStrength(values.password);
  if (!values.password) {
    errors.password = 'Password is required';
  } else if (!pwStrength.isValid) {
    errors.password = 'Password must meet all complexity requirements';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!values.agreeTerms) {
    errors.agreeTerms = 'You must accept the Seller Agreement and Terms';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validates 6-digit confirmation or OTP code
 */
export const isValidConfirmationCode = (code) => {
  if (!code || typeof code !== 'string') return false;
  return /^\d{6}$/.test(code.trim());
};
