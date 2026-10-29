# Enterprise React Authentication System with AWS Cognito

A production-ready, accessible, and responsive multi-role authentication platform built with **React**, **Vite**, **Tailwind CSS**, and **Amazon Cognito** via the modern **AWS Amplify v6 SDK**.

---

## 📸 Reference Modal Design Implementation

The authentication modal faithfully recreates the provided reference design:
- **Modal Container**: Centered white dialog with smooth rounded corners (`rounded-3xl`), subtle elevation shadow (`shadow-modal`), and dark semi-transparent backdrop overlay (`bg-black/60 backdrop-blur-sm`).
- **Heading**: Deep blue **Login** heading accented by a vibrant pink pill underline.
- **Top Action**: Google sign-in button featuring the official multi-color "G" SVG icon with an elegant divider.
- **Functional Tabs**: Toggle between **Use Phone Number** and **Use Email Address**.
- **Mobile Input**: Country selector featuring the **Indian Flag (🇮🇳)** and `+91` calling code prefix with a 10-digit mobile field.
- **Remember Me**: Styled checkbox preserving session preferences.
- **Primary CTA**: Rounded yellow **Continue** button (`#FFC000`) with loading states.
- **Top Right**: Vibrant pink close icon button.
- **Multi-Role Registration Links**: Distinct **Register as Buyer** and **Register as Seller** links.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite 6 |
| **Styling** | Tailwind CSS 3.4 with Custom Brand Colors & Dark Mode |
| **Icons** | Lucide React |
| **Routing** | React Router v6 |
| **AWS SDK** | AWS Amplify v6 (`@aws-amplify/auth`) |
| **Identity Provider** | Amazon Cognito User Pools (SRP + OAuth 2.0) |
| **Testing** | Node.js 22 Native Test Runner (`node:test`, `node:assert`) |

---

## 🚀 Quick Start Commands (Windows PowerShell)

### 1. Install Dependencies
```powershell
npm install
```

### 2. Run the Unit Test Suite
```powershell
npm test
```
*Executes all 20 unit tests for email, Indian mobile (+91), password strength, and registration schemas.*

### 3. Start the Local Development Server
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```powershell
npm run build
```
Generates optimized, tree-shaken static assets in `dist/`.

---

## 📁 Project Structure

```
├── .env.example              # Public AWS Cognito configuration template
├── .env                      # Local environment settings
├── AWS_SETUP_GUIDE.md        # Comprehensive AWS Console setup instructions
├── SECURITY_CHECKLIST.md     # Security perimeter and defense-in-depth checklist
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Brand colors and design system tokens
├── vite.config.js            # Vite build and runtime configuration
├── tests/
│   └── validation.test.js    # Unit test suite (20 tests covering all auth schemas)
└── src/
    ├── main.jsx              # React mounting root
    ├── App.jsx               # Route definitions and global AuthModal mount
    ├── index.css             # Tailwind directives and custom animation keyframes
    ├── config/
    │   └── amplify.js        # AWS Amplify v6 configuration & live detection
    ├── context/
    │   ├── AuthContext.jsx   # Authentication context & session state
    │   └── ThemeContext.jsx  # Dark/light mode theme provider
    ├── hooks/
    │   ├── useAuth.js        # Authentication hook
    │   └── useTheme.js       # Color mode hook
    ├── utils/
    │   └── validation.js     # Email, Indian phone, password meter, and form validators
    ├── services/
    │   └── authService.js    # AWS Amplify v6 API bridge with fallback demo engine
    ├── routes/
    │   └── ProtectedRoute.jsx# Role-aware route guard
    ├── components/
    │   ├── common/
    │   │   ├── Button.jsx        # Rounded button with yellow continue variant
    │   │   ├── Input.jsx         # Accessible form inputs with icons
    │   │   ├── PasswordInput.jsx # Password input with show/hide toggle & meter
    │   │   ├── LoadingSpinner.jsx# SVG loading spinner
    │   │   ├── Alert.jsx         # Colored feedback banners
    │   │   └── ThemeToggle.jsx   # Light/dark mode toggle button
    │   └── auth/
    │       ├── AuthModal.jsx     # Primary reference authentication dialog
    │       ├── PhoneLogin.jsx    # Indian (+91) mobile login form
    │       ├── EmailLogin.jsx    # Email and password login form
    │       ├── GoogleLogin.jsx   # Google OAuth federation trigger
    │       ├── OtpVerification.jsx# 6-box OTP code verification component
    │       └── ForgotPassword.jsx# Password recovery & reset component
    └── pages/
        ├── Home.jsx          # SaaS landing page with reference modal showcase
        ├── BuyerSignup.jsx   # Buyer registration with password strength meter
        ├── SellerSignup.jsx  # Seller onboarding (Store details, Category, GSTIN)
        ├── Dashboard.jsx     # Role-based dashboard with Cognito session inspector
        └── NotFound.jsx      # 404 error page
```

---

## 🧪 Local Testing Guide

### A. Testing in Simulated Sandbox Mode (Out of the Box)
Before configuring your AWS credentials in `.env`, the application automatically runs in **Live Demo Mode** so you can immediately preview and interact with all UI flows:

1. **Email Login**:
   - Email: `buyer@example.com`
   - Password: `Password123!`
   - Seller Email: `seller@example.com` / `Password123!`
2. **Phone Number OTP Login**:
   - Enter any 10-digit Indian mobile number (e.g., `9876543210`).
   - Click the yellow **Continue** button.
   - Enter demo OTP: `123456`.
3. **Buyer Registration**:
   - Navigate to **Register as Buyer** (`/signup/buyer`).
   - Fill in details. Use confirmation code `123456` in the verification step.
4. **Seller Registration**:
   - Navigate to **Register as Seller** (`/signup/seller`).
   - Select your store category and fill in business details.
5. **Session Inspector**:
   - Navigate to `/dashboard` after login. Click **Inspect Cognito Session Claims** to see the simulated decoded JWT claims.

### B. Testing with Live AWS Cognito
1. Follow [AWS_SETUP_GUIDE.md](file:///t:/Project%20R/AWS_SETUP_GUIDE.md) to create your AWS Cognito User Pool.
2. Update `.env` with:
   ```env
   VITE_AWS_REGION=ap-south-1
   VITE_COGNITO_USER_POOL_ID=ap-south-1_xxxxxxxxx
   VITE_COGNITO_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. Restart the dev server (`npm run dev`).
4. The application automatically detects real credentials and performs 100% native AWS Amplify v6 API requests directly against AWS Cognito endpoints!

---

## 🔄 How the React App Communicates with AWS Cognito

```
[User Form Action]
       │
       ▼
[src/context/AuthContext.jsx] (State & Session Management)
       │
       ▼
[src/services/authService.js] (Wrapper & Error Mapping)
       │
       ▼
[@aws-amplify/auth] (AWS Amplify v6 Modular SDK)
       │
       ▼ HTTPS / TLS 1.3 (SRP zero-knowledge proof)
[Amazon Cognito User Pool Endpoint]
(https://cognito-idp.<region>.amazonaws.com)
       │
       ▼ Returns
[JWT Tokens: ID Token, Access Token, Refresh Token]
       │
       ▼
[AuthContext updates User State & Unlocks Protected Routes]
```

---

## 🔧 Troubleshooting Common Cognito Errors

| Cognito Exception | Cause | Resolution |
|---|---|---|
| `NotAuthorizedException` | Incorrect password or unconfirmed user | Check credentials or complete verification step |
| `UserNotConfirmedException` | User registered but hasn't entered 6-digit confirmation code | Direct user to verification view with `confirmSignUp` |
| `UsernameExistsException` | Email or phone is already registered | Display sign-in prompt instead of duplicate registration |
| `InvalidPasswordException` | Password violates Cognito minimum policy | Enforce 8+ chars, uppercase, lowercase, number, symbol |
| `CodeMismatchException` | Entered confirmation OTP code is incorrect | Request user to re-enter code or click "Resend OTP" |
| `ExpiredCodeException` | Verification code expired (typically 24 hours for email, 1 hour for SMS) | Trigger `resendSignUpCode` |
| `LimitExceededException` | Too many consecutive failed authentication attempts | Wait 5-15 minutes or implement CAPTCHA/ASF |
| `InvalidParameterException` | Phone number not in E.164 format | Ensure number is prefixed with `+91` for India |

---

## 🛡️ Security Best Practices

Refer to [SECURITY_CHECKLIST.md](file:///t:/Project%20R/SECURITY_CHECKLIST.md) for full architecture standards including:
- Why public clients must never use Client Secrets.
- How tokens are managed in memory rather than custom `localStorage`.
- How role permissions (`custom:role`) are verified cryptographically in backend Lambda authorizers.
