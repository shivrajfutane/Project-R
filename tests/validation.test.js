import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail,
  isValidIndianPhone,
  formatPhoneToE164,
  checkPasswordStrength,
  validateBuyerSignup,
  validateSellerSignup,
  isValidConfirmationCode,
} from '../src/utils/validation.js';

test('Email validation tests', async (t) => {
  await t.test('accepts valid email addresses', () => {
    assert.equal(isValidEmail('user@example.com'), true);
    assert.equal(isValidEmail('john.doe+test@domain.co.in'), true);
    assert.equal(isValidEmail('buyer123@amazon.aws.internal'), true);
  });

  await t.test('rejects invalid email formats', () => {
    assert.equal(isValidEmail(''), false);
    assert.equal(isValidEmail('notanemail'), false);
    assert.equal(isValidEmail('missing@domain'), false);
    assert.equal(isValidEmail('@nodomain.com'), false);
    assert.equal(isValidEmail(null), false);
  });
});

test('Indian Phone number validation tests', async (t) => {
  await t.test('accepts valid 10-digit Indian numbers starting with 6, 7, 8, or 9', () => {
    assert.equal(isValidIndianPhone('9876543210'), true);
    assert.equal(isValidIndianPhone('8765432109'), true);
    assert.equal(isValidIndianPhone('7654321098'), true);
    assert.equal(isValidIndianPhone('6543210987'), true);
  });

  await t.test('accepts +91 or 91 prefixed 12-digit Indian numbers', () => {
    assert.equal(isValidIndianPhone('919876543210'), true);
  });

  await t.test('rejects numbers starting with invalid digits or invalid lengths', () => {
    assert.equal(isValidIndianPhone('1234567890'), false);
    assert.equal(isValidIndianPhone('5555555555'), false);
    assert.equal(isValidIndianPhone('98765'), false);
    assert.equal(isValidIndianPhone('987654321000'), false);
    assert.equal(isValidIndianPhone('abcdefghij'), false);
  });

  await t.test('formats numbers to E.164 standard (+91XXXXXXXXXX)', () => {
    assert.equal(formatPhoneToE164('9876543210'), '+919876543210');
    assert.equal(formatPhoneToE164('919876543210'), '+919876543210');
  });
});

test('Password strength & AWS Cognito compliance tests', async (t) => {
  await t.test('flags weak passwords that violate Cognito policies', () => {
    const weak = checkPasswordStrength('pass');
    assert.equal(weak.isValid, false);
    assert.equal(weak.checks.minLength, false);
  });

  await t.test('passes complex passwords that satisfy all Cognito rules', () => {
    const strong = checkPasswordStrength('Secure#Pass2026!');
    assert.equal(strong.isValid, true);
    assert.equal(strong.score, 5);
    assert.equal(strong.checks.minLength, true);
    assert.equal(strong.checks.hasUpper, true);
    assert.equal(strong.checks.hasLower, true);
    assert.equal(strong.checks.hasNumber, true);
    assert.equal(strong.checks.hasSpecial, true);
  });
});

test('Buyer signup validation tests', async (t) => {
  await t.test('fails when required fields are missing', () => {
    const res = validateBuyerSignup({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    });
    assert.equal(res.isValid, false);
    assert.ok(res.errors.name);
    assert.ok(res.errors.email);
    assert.ok(res.errors.password);
    assert.ok(res.errors.agreeTerms);
  });

  await t.test('fails when password confirmation does not match', () => {
    const res = validateBuyerSignup({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'Password123!',
      confirmPassword: 'MismatchPassword1!',
      agreeTerms: true,
    });
    assert.equal(res.isValid, false);
    assert.equal(res.errors.confirmPassword, 'Passwords do not match');
  });

  await t.test('succeeds with valid buyer details', () => {
    const res = validateBuyerSignup({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '9876543210',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      agreeTerms: true,
    });
    assert.equal(res.isValid, true);
    assert.equal(Object.keys(res.errors).length, 0);
  });
});

test('Seller signup validation tests', async (t) => {
  await t.test('requires store name and category for merchant onboarding', () => {
    const res = validateSellerSignup({
      name: 'Rajesh Patel',
      email: 'rajesh@store.com',
      phone: '9876543211',
      storeName: '',
      category: '',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      agreeTerms: true,
    });
    assert.equal(res.isValid, false);
    assert.ok(res.errors.storeName);
    assert.ok(res.errors.category);
  });

  await t.test('succeeds with valid seller details', () => {
    const res = validateSellerSignup({
      name: 'Rajesh Patel',
      email: 'rajesh@store.com',
      phone: '9876543211',
      storeName: 'Patel Electronics Hub',
      category: 'Consumer Electronics & Gadgets',
      gstNumber: '22AAAAA0000A1Z5',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      agreeTerms: true,
    });
    assert.equal(res.isValid, true);
    assert.equal(Object.keys(res.errors).length, 0);
  });
});

test('Confirmation code validation tests', async (t) => {
  await t.test('validates 6-digit numeric codes', () => {
    assert.equal(isValidConfirmationCode('123456'), true);
    assert.equal(isValidConfirmationCode('000123'), true);
    assert.equal(isValidConfirmationCode('12345'), false);
    assert.equal(isValidConfirmationCode('1234567'), false);
    assert.equal(isValidConfirmationCode('abcdef'), false);
  });
});
