# Cloud Authentication Security Checklist & Architecture

This security audit specification details how the React frontend and AWS Cognito backend establish a defense-in-depth security perimeter.

---

## 1. Secrets & Credential Management

- [x] **No AWS IAM Secret Keys in Client Bundle**
  - The frontend never stores `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY`.
  - All communication uses Cognito User Pool public endpoints (`https://cognito-idp.<region>.amazonaws.com`).
- [x] **No Client Secret on Cognito App Client**
  - The App Client is registered as a **Public client** in Amazon Cognito.
  - Client secrets in browser bundles can be reverse-engineered in seconds via browser developer tools.
- [x] **Vite Environment Variables Transparency**
  - All variables prefixed with `VITE_` (`VITE_AWS_REGION`, `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_USER_POOL_CLIENT_ID`) are public metadata used only for routing requests to the correct AWS endpoints.
- [x] **Zero Raw Password Storage**
  - Passwords are never written to `localStorage`, `sessionStorage`, cookies, Redux state, or console logs.
  - SRP (Secure Remote Password) protocol transmits only cryptographic verifiers, meaning cleartext passwords are never sent over the wire during standard Cognito authentication.

---

## 2. Session & Token Management

- [x] **AWS Amplify v6 Secure Token Handling**
  - JWT tokens (ID Token, Access Token, Refresh Token) are managed directly by `@aws-amplify/auth`.
  - Avoided custom `localStorage.setItem('token', ...)` implementations that leave tokens vulnerable to XSS extraction.
- [x] **Short-Lived Access Tokens**
  - Default Cognito access tokens expire in 1 hour.
  - Amplify automatically handles silent token refresh via the Refresh Token without user disruption.
- [x] **Global Sign-out Support**
  - `signOut({ global: true })` revokes all active refresh tokens for the user across all devices via the Cognito API.
- [x] **Protected Routes Guard**
  - Routes (`/dashboard`) require an active session verified by `getCurrentUser()` and `fetchUserAttributes()`.

---

## 3. Account Enumeration & Brute-Force Defenses

- [x] **Prevent Account Enumeration in Password Recovery**
  - During "Forgot Password", the application displays a generic confirmation stating that if an account exists, a verification code was sent.
  - In Cognito, set **Prevent User Existence Errors** to **Enabled** under User Pool > App integration > Advanced settings.
- [x] **Rate Limiting & Lockout**
  - Amazon Cognito enforces automatic rate limiting and exponential backoffs on failed attempts (`LimitExceededException` / `TooManyRequestsException`).
  - Optional: Enable **Cognito Advanced Security Features (ASF)** for automated adaptive authentication, compromised credential checks, and IP-based risk scores.

---

## 4. Multi-Role Authorization & Trust Boundaries

- [x] **Frontend Validation is Usability, Not Security**
  - All client form validation (`src/utils/validation.js`) serves user experience and responsiveness.
  - True authorization occurs in the cloud: Cognito user pools enforce schema validation, password policies, and confirmation state.
- [x] **Role Tampering Prevention**
  - The role (`buyer` vs `seller`) is stored in Cognito as a custom attribute (`custom:role`).
  - Backend services (AWS Lambda, API Gateway) must inspect the cryptographically signed JWT `claims['custom:role']` or Cognito User Groups, rather than trusting any role header sent from the client.

---

## 5. Network & Transport Security

- [x] **HTTPS Enforcement**
  - All Cognito authentication requests are strictly sent over TLS 1.3 / HTTPS.
  - When deployed on AWS Amplify Hosting or CloudFront, HTTP to HTTPS redirection is active.
- [x] **Content Security Policy (CSP)**
  - When configuring hosting headers, whitelist Cognito API endpoints:
    ```http
    connect-src 'self' https://cognito-idp.<region>.amazonaws.com https://<your-domain>.auth.<region>.amazoncognito.com;
    ```
- [x] **Input Sanitization**
  - Phone numbers are validated against strict 10-digit Indian mobile formats (`^[6-9]\d{9}$`) and normalized into E.164 (`+91XXXXXXXXXX`).
  - Emails are normalized with RFC-compliant validation and trimmed.
