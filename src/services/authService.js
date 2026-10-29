import {
  signUp,
  confirmSignUp,
  resendSignUpCode,
  signIn,
  confirmSignIn,
  signInWithRedirect,
  signOut,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
} from 'aws-amplify/auth';
import { isAwsConfigured } from '../config/amplify';

/**
 * Translates AWS Cognito error codes to user-friendly UI messages
 */
export const mapCognitoError = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const code = error.name || error.code || '';
  const message = error.message || '';

  switch (code) {
    case 'UsernameExistsException':
      return 'An account with this email or phone number already exists. Please sign in instead.';
    case 'NotAuthorizedException':
      return 'Incorrect username or password. Please verify your credentials.';
    case 'UserNotFoundException':
      return 'No registered account found with these details. Please create an account.';
    case 'UserNotConfirmedException':
      return 'Your account email/phone has not been verified yet. Please complete verification.';
    case 'CodeMismatchException':
      return 'The verification code you entered is invalid. Please double-check and try again.';
    case 'ExpiredCodeException':
      return 'This verification code has expired. Please request a new code.';
    case 'LimitExceededException':
      return 'Exceeded maximum attempts. For your security, please wait a few minutes before trying again.';
    case 'InvalidPasswordException':
      return 'Password does not satisfy the security requirements (minimum 8 characters, uppercase, lowercase, number, symbol).';
    case 'InvalidParameterException':
      return message.includes('phone')
        ? 'Please enter a valid phone number in E.164 format (e.g. +91XXXXXXXXXX).'
        : 'Invalid input provided. Please verify all fields.';
    case 'TooManyRequestsException':
    case 'TooManyFailedAttemptsException':
      return 'Too many failed requests. Please try again later.';
    case 'NetworkError':
      return 'Network connection issue. Please check your internet connectivity.';
    default:
      return message || 'Authentication failed. Please verify your details and try again.';
  }
};

/**
 * In-memory fallback simulation store for local testing
 * activated only when VITE_COGNITO_USER_POOL_ID is not configured in .env
 */
const mockStore = {
  users: [
    {
      username: 'buyer@example.com',
      email: 'buyer@example.com',
      phone_number: '+919876543210',
      password: 'Password123!',
      name: 'Priya Sharma',
      'custom:role': 'buyer',
      isVerified: true,
    },
    {
      username: 'seller@example.com',
      email: 'seller@example.com',
      phone_number: '+919876543211',
      password: 'Password123!',
      name: 'Rajesh Patel',
      'custom:role': 'seller',
      'custom:store_name': 'Patel Electronics & Gadgets',
      'custom:seller_category': 'Electronics',
      isVerified: true,
    },
  ],
  pendingOtps: new Map(), // phone/email -> { code, expiresAt, context }
};

/**
 * Authenticate with Email & Password
 */
export const signInWithEmail = async (email, password) => {
  if (isAwsConfigured()) {
    try {
      const result = await signIn({
        username: email.trim(),
        password,
      });
      return {
        success: true,
        isSignedIn: result.isSignedIn,
        nextStep: result.nextStep,
      };
    } catch (err) {
      throw new Error(mapCognitoError(err));
    }
  }

  // Fallback demo mode simulation
  console.info('[Mock Auth] Signing in with email:', email);
  await new Promise((r) => setTimeout(r, 650));

  const found = mockStore.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!found || found.password !== password) {
    throw new Error('Incorrect email or password. (Demo credentials: buyer@example.com / Password123!)');
  }

  if (!found.isVerified) {
    const err = new Error('Your account is not verified yet.');
    err.name = 'UserNotConfirmedException';
    throw err;
  }

  // Save session to sessionStorage for demo
  const mockUser = {
    userId: 'mock-usr-' + Math.random().toString(36).substring(2, 9),
    username: found.email,
    signInDetails: { loginId: found.email },
    attributes: {
      email: found.email,
      name: found.name,
      phone_number: found.phone_number,
      'custom:role': found['custom:role'],
      'custom:store_name': found['custom:store_name'],
      'custom:seller_category': found['custom:seller_category'],
      email_verified: 'true',
    },
  };
  sessionStorage.setItem('mock_auth_user', JSON.stringify(mockUser));

  return {
    success: true,
    isSignedIn: true,
    nextStep: { signInStep: 'DONE' },
    mockUser,
  };
};

/**
 * Initiate Phone OTP Sign In
 */
export const initiatePhoneOtp = async (phoneNumber) => {
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;

  if (isAwsConfigured()) {
    try {
      // With Cognito Custom Auth flow / SMS MFA, initiate auth with phone
      const result = await signIn({
        username: formattedPhone,
        options: {
          authFlowType: 'CUSTOM_WITHOUT_SRP',
        },
      });
      return {
        success: true,
        phoneNumber: formattedPhone,
        nextStep: result.nextStep,
      };
    } catch (err) {
      // If custom flow not configured in Cognito, return clear guidance
      console.warn('Cognito Phone auth error:', err);
      throw new Error(mapCognitoError(err));
    }
  }

  // Demo simulation mode
  console.info('[Mock Auth] Initiating OTP for phone:', formattedPhone);
  await new Promise((r) => setTimeout(r, 600));

  const code = '123456'; // Default demo OTP
  mockStore.pendingOtps.set(formattedPhone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  console.info(`%c[DEMO OTP CODE] ${code} for ${formattedPhone}`, 'background: #FBBF24; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px;');

  return {
    success: true,
    phoneNumber: formattedPhone,
    codeSent: true,
    demoCode: code,
  };
};

/**
 * Confirm Phone OTP
 */
export const verifyPhoneOtp = async (phoneNumber, code) => {
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;

  if (isAwsConfigured()) {
    try {
      const result = await confirmSignIn({
        challengeResponse: code,
      });
      return {
        success: true,
        isSignedIn: result.isSignedIn,
        nextStep: result.nextStep,
      };
    } catch (err) {
      throw new Error(mapCognitoError(err));
    }
  }

  // Demo simulation mode
  await new Promise((r) => setTimeout(r, 600));
  const record = mockStore.pendingOtps.get(formattedPhone);

  if (!record || (code !== record.code && code !== '123456')) {
    throw new Error('Invalid OTP code. Please enter the 6-digit code (use 123456 in demo mode).');
  }

  // Find or create phone user
  let user = mockStore.users.find((u) => u.phone_number === formattedPhone);
  if (!user) {
    user = {
      username: formattedPhone,
      phone_number: formattedPhone,
      email: `${formattedPhone.replace(/\D/g, '')}@buyer.example.com`,
      name: 'Mobile User',
      'custom:role': 'buyer',
      isVerified: true,
    };
    mockStore.users.push(user);
  }

  const mockUser = {
    userId: 'mock-usr-' + Math.random().toString(36).substring(2, 9),
    username: formattedPhone,
    attributes: {
      phone_number: formattedPhone,
      email: user.email,
      name: user.name,
      'custom:role': user['custom:role'],
    },
  };
  sessionStorage.setItem('mock_auth_user', JSON.stringify(mockUser));
  mockStore.pendingOtps.delete(formattedPhone);

  return {
    success: true,
    isSignedIn: true,
    mockUser,
  };
};

/**
 * Register a new User in Cognito (Buyer or Seller)
 */
export const registerUser = async ({
  username,
  email,
  phone_number,
  password,
  name,
  role = 'buyer',
  storeName,
  sellerCategory,
  gstNumber,
}) => {
  const userAttributes = {
    email: email.trim(),
    name: name.trim(),
    'custom:role': role,
  };

  if (phone_number) {
    userAttributes.phone_number = phone_number.startsWith('+')
      ? phone_number
      : `+91${phone_number.replace(/\D/g, '')}`;
  }

  if (role === 'seller') {
    if (storeName) userAttributes['custom:store_name'] = storeName.trim();
    if (sellerCategory) userAttributes['custom:seller_category'] = sellerCategory;
    if (gstNumber) userAttributes['custom:gst_number'] = gstNumber.trim().toUpperCase();
  }

  if (isAwsConfigured()) {
    try {
      const result = await signUp({
        username: email.trim(),
        password,
        options: {
          userAttributes,
          autoSignIn: true,
        },
      });

      return {
        success: true,
        userId: result.userId,
        isSignUpComplete: result.isSignUpComplete,
        nextStep: result.nextStep,
      };
    } catch (err) {
      throw new Error(mapCognitoError(err));
    }
  }

  // Demo simulation mode
  console.info('[Mock Auth] Registering new user:', { email, role, name });
  await new Promise((r) => setTimeout(r, 700));

  const existing = mockStore.users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (existing) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  const newUser = {
    username: email.trim(),
    email: email.trim(),
    phone_number: userAttributes.phone_number || '',
    password,
    name: name.trim(),
    'custom:role': role,
    'custom:store_name': storeName || '',
    'custom:seller_category': sellerCategory || '',
    isVerified: false,
  };

  mockStore.users.push(newUser);
  mockStore.pendingOtps.set(email.trim().toLowerCase(), {
    code: '123456',
    expiresAt: Date.now() + 10 * 60 * 1000,
  });

  console.info(`%c[DEMO VERIFICATION CODE] 123456 for ${email}`, 'background: #EC4899; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');

  return {
    success: true,
    userId: 'mock-new-' + Date.now(),
    isSignUpComplete: false,
    nextStep: {
      signUpStep: 'CONFIRM_SIGN_UP',
      codeDeliveryDetails: {
        deliveryMedium: 'EMAIL',
        destination: email.trim(),
      },
    },
  };
};

/**
 * Confirm Sign Up with 6-digit confirmation code
 */
export const confirmAccountVerification = async (username, code) => {
  if (isAwsConfigured()) {
    try {
      const result = await confirmSignUp({
        username: username.trim(),
        confirmationCode: code.trim(),
      });
      return {
        success: true,
        isSignUpComplete: result.isSignUpComplete,
        nextStep: result.nextStep,
      };
    } catch (err) {
      throw new Error(mapCognitoError(err));
    }
  }

  // Demo simulation mode
  await new Promise((r) => setTimeout(r, 500));
  const normalized = username.trim().toLowerCase();
  const user = mockStore.users.find((u) => u.email.toLowerCase() === normalized || u.username === normalized);

  if (!user) {
    throw new Error('Account not found.');
  }

  if (code !== '123456') {
    throw new Error('Invalid confirmation code. In demo mode, use code: 123456');
  }

  user.isVerified = true;
  mockStore.pendingOtps.delete(normalized);

  return {
    success: true,
    isSignUpComplete: true,
    nextStep: { signUpStep: 'DONE' },
  };
};

/**
 * Resend sign up verification code
 */
export const resendAccountVerificationCode = async (username) => {
  if (isAwsConfigured()) {
    try {
      const result = await resendSignUpCode({
        username: username.trim(),
      });
      return {
        success: true,
        deliveryDetails: result,
      };
    } catch (err) {
      throw new Error(mapCognitoError(err));
    }
  }

  await new Promise((r) => setTimeout(r, 400));
  console.info('[Mock Auth] Resent verification code 123456 to:', username);
  return {
    success: true,
    deliveryDetails: {
      deliveryMedium: 'EMAIL',
      destination: username,
    },
  };
};

/**
 * Initiate Forgot Password Flow
 */
export const requestForgotPassword = async (username) => {
  if (isAwsConfigured()) {
    try {
      const output = await resetPassword({ username: username.trim() });
      return {
        success: true,
        nextStep: output.nextStep,
      };
    } catch (err) {
      throw new Error(mapCognitoError(err));
    }
  }

  await new Promise((r) => setTimeout(r, 500));
  console.info('[Mock Auth] Password reset requested for:', username);
  return {
    success: true,
    nextStep: {
      resetPasswordStep: 'CONFIRM_RESET_PASSWORD_WITH_CODE',
      codeDeliveryDetails: {
        deliveryMedium: 'EMAIL',
        destination: username,
      },
    },
  };
};

/**
 * Confirm Forgot Password with code and new password
 */
export const completePasswordReset = async (username, confirmationCode, newPassword) => {
  if (isAwsConfigured()) {
    try {
      await confirmResetPassword({
        username: username.trim(),
        confirmationCode: confirmationCode.trim(),
        newPassword,
      });
      return { success: true };
    } catch (err) {
      throw new Error(mapCognitoError(err));
    }
  }

  await new Promise((r) => setTimeout(r, 500));
  if (confirmationCode !== '123456') {
    throw new Error('Invalid reset code. Use 123456 in demo mode.');
  }

  const user = mockStore.users.find(
    (u) => u.email.toLowerCase() === username.trim().toLowerCase()
  );
  if (user) {
    user.password = newPassword;
  }

  return { success: true };
};

/**
 * Sign In with Google via Cognito Hosted UI Federation
 */
export const signInWithGoogle = async () => {
  if (isAwsConfigured()) {
    try {
      await signInWithRedirect({ provider: 'Google' });
    } catch (err) {
      throw new Error(mapCognitoError(err));
    }
  } else {
    // Demo simulation: log in as Google user
    console.info('[Mock Auth] Simulating Google OAuth Sign-in');
    const googleUser = {
      userId: 'google-usr-' + Math.random().toString(36).substring(2, 9),
      username: 'google.user@example.com',
      attributes: {
        email: 'google.user@example.com',
        name: 'Alex Johnson (Google)',
        'custom:role': 'buyer',
        email_verified: 'true',
        identities: JSON.stringify([{ providerName: 'Google' }]),
      },
    };
    sessionStorage.setItem('mock_auth_user', JSON.stringify(googleUser));
    window.location.href = '/dashboard';
  }
};

/**
 * Get current authenticated user profile and attributes
 */
export const getAuthenticatedUser = async () => {
  if (isAwsConfigured()) {
    try {
      const user = await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const session = await fetchAuthSession();

      return {
        userId: user.userId,
        username: user.username,
        signInDetails: user.signInDetails,
        attributes,
        tokens: {
          idToken: session.tokens?.idToken?.toString(),
          accessToken: session.tokens?.accessToken?.toString(),
        },
      };
    } catch (err) {
      // User is not signed in
      return null;
    }
  }

  // Demo simulation mode
  const stored = sessionStorage.getItem('mock_auth_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Sign Out
 */
export const logoutUser = async (global = false) => {
  if (isAwsConfigured()) {
    try {
      await signOut({ global });
    } catch (err) {
      console.error('Logout error:', err);
    }
  } else {
    sessionStorage.removeItem('mock_auth_user');
  }
};
