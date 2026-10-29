# AWS Amazon Cognito Setup & Deployment Guide

This guide walks you through setting up an Amazon Cognito User Pool with email sign-in, mobile phone number authentication, Google OAuth federation, and multi-role buyer/seller attributes, followed by deploying the frontend to AWS Amplify Hosting.

---

## Part 1: Amazon Cognito User Pool Setup

### Step 1: Sign in to AWS Console & Choose Region
1. Log into your [AWS Management Console](https://console.aws.amazon.com/).
2. Select your target AWS Region in the top right header.
   - Recommended for India / South Asia: `ap-south-1` (Mumbai).
   - Recommended for US / Global: `us-east-1` (N. Virginia).
3. Search for **Cognito** in the top search bar and open **Amazon Cognito**.

---

### Step 2: Create User Pool - Step 1: Configure Sign-in Experience
1. Click **Create user pool**.
2. **Cognito user pool sign-in options**:
   - Check **Email**
   - Check **Phone number**
3. Under **User name requirements**:
   - Leave "Allow user to sign in with preferred username" unchecked unless desired.
4. Click **Next**.

---

### Step 3: Step 2: Configure Security Requirements
1. **Password policy**:
   - Select **Cognito defaults**:
     - Minimum length: `8` characters
     - Requires at least 1 number
     - Requires at least 1 special character (`^$*.[]{}()?-"!@#%&/\,><':;|_~+=\`)
     - Requires at least 1 uppercase letter
     - Requires at least 1 lowercase letter
   *(This exact policy is enforced client-side in `src/utils/validation.js`)*.
2. **Multi-factor authentication (MFA)**:
   - Select **Optional MFA** or **No MFA** (for initial development).
   - If selecting SMS MFA: Note that AWS SNS charges apply per SMS, and you will need an IAM role for SNS message delivery.
3. **User account recovery**:
   - Check **Enable self-service account recovery**.
   - Delivery method: Select **Email only** or **Email if available, otherwise SMS**.
4. Click **Next**.

---

### Step 4: Step 3: Configure Sign-up Experience
1. **Self-service sign-up**:
   - Check **Enable self-registration**.
2. **Attribute verification and user account confirmation**:
   - Check **Allow Cognito to automatically send messages to verify and confirm**.
   - Select **Send email message, verify email address**.
3. **Required attributes**:
   - Ensure `email` is marked as required.
   - Add `name` (required or optional).
4. **Custom attributes** *(Essential for Buyer & Seller multi-role separation)*:
   Click **Add custom attribute** and add the following:
   - `custom:role` (Type: `String`, Min: `1`, Max: `20`, Mutable: `True`)
   - `custom:store_name` (Type: `String`, Min: `1`, Max: `100`, Mutable: `True`)
   - `custom:seller_category` (Type: `String`, Min: `1`, Max: `100`, Mutable: `True`)
   - `custom:gst_number` (Type: `String`, Min: `1`, Max: `30`, Mutable: `True`)
5. Click **Next**.

---

### Step 5: Step 4: Configure Message Delivery
1. **Email provider**:
   - For rapid initial testing: Select **Send email with Cognito** (free tier includes 50 emails/day without domain verification).
   - For production: Select **Send email with Amazon SES** and verify your domain in SES.
2. **FROM email address**: Select default or your verified SES identity.
3. Click **Next**.

---

### Step 6: Step 5: Integrate Your App (App Client Setup)
1. **User pool name**: Enter `cloudmarket-user-pool`.
2. **Hosted authentication pages**:
   - If using Google sign-in: Check **Use the Cognito Hosted UI**.
   - Enter a unique **Cognito domain prefix** (e.g., `cloudmarket-auth-YOURNAME`).
3. **Initial app client**:
   - App client type: Select **Public client** (Single-page application).
   - App client name: Enter `cloudmarket-react-web`.
   - ⚠️ **CRITICAL SECURITY REQUIREMENT**:
     - Make sure **Generate a client secret** is **UNCHECKED** / **DISABLED**.
     - Public browser applications (React, SPA) cannot keep client secrets confidential. A secret in browser code will compromise your Cognito pool.
4. **Allowed callback URLs** (For Google/Hosted UI sign-in redirects):
   - Local: `http://localhost:3000/dashboard`
   - Production (add once deployed): `https://your-domain.amplifyapp.com/dashboard`
5. **Allowed sign-out URLs**:
   - Local: `http://localhost:3000/`
   - Production: `https://your-domain.amplifyapp.com/`
6. **Advanced app client settings**:
   - Open **Authentication flows**:
     - Check **ALLOW_USER_SRP_AUTH** (Secure Remote Password - secure zero-knowledge proof)
     - Check **ALLOW_USER_PASSWORD_AUTH** (Standard auth)
     - Check **ALLOW_REFRESH_TOKEN_AUTH** (Token refresh)
     - Check **ALLOW_CUSTOM_AUTH** (if using SMS passwordless OTP)
   - Open **OAuth 2.0 grant types**:
     - Check **Authorization code grant**
   - Open **OpenID Connect scopes**:
     - Check `email`, `openid`, `phone`, `profile`, `aws.cognito.signin.user.admin`.
7. Click **Next**, review all settings, and click **Create user pool**.

---

### Step 7: (Optional) Google Sign-in Federation Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** of type *Web application*.
3. Add **Authorized redirect URI**:
   `https://<your-cognito-domain>.auth.<region>.amazoncognito.com/oauth2/idpresponse`
4. Return to the AWS Cognito Console:
   - Go to your User Pool > **Sign-in experience** > **Federated identity provider sign-in**.
   - Click **Add identity provider** > Select **Google**.
   - Paste your Google **Client ID** and **Client secret**.
   - Set Authorized scopes: `profile email openid`.
   - Map Google attributes to Cognito attributes:
     - `email` -> `email`
     - `name` -> `name`
5. Go to **App integration** > Your App Client > **Hosted UI** > Edit:
   - Check **Google** under Identity Providers.

---

## Part 2: Connect the React Frontend

Open the `.env` file in the project root and enter your values:

```env
# AWS Region
VITE_AWS_REGION=ap-south-1

# From User Pool > General Information > User pool ID
VITE_COGNITO_USER_POOL_ID=ap-south-1_XXXXXXXXX

# From User Pool > App integration > App client list > Client ID
VITE_COGNITO_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX

# Optional: If Google Sign-in or Hosted UI is enabled
VITE_COGNITO_DOMAIN=https://cloudmarket-auth-YOURNAME.auth.ap-south-1.amazoncognito.com
VITE_REDIRECT_SIGN_IN_URL=http://localhost:3000/dashboard
VITE_REDIRECT_SIGN_OUT_URL=http://localhost:3000/
```

Restart the Vite development server:
```powershell
npm run dev
```

---

## Part 3: Deploying to AWS Amplify Hosting

### Option A: AWS Amplify Console (Recommended - CI/CD via Git)
1. Push your repository to GitHub, GitLab, or AWS CodeCommit.
2. In the AWS Management Console, open **AWS Amplify**.
3. Click **Host an application**.
4. Select your Git provider and authorize repository access.
5. Choose your repository and the `main` branch.
6. Amplify automatically detects the Vite build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
7. Under **Environment variables**, add:
   - `VITE_AWS_REGION`: `your-region`
   - `VITE_COGNITO_USER_POOL_ID`: `your-pool-id`
   - `VITE_COGNITO_USER_POOL_CLIENT_ID`: `your-client-id`
   - `VITE_REDIRECT_SIGN_IN_URL`: `https://main.xxxx.amplifyapp.com/dashboard`
   - `VITE_REDIRECT_SIGN_OUT_URL`: `https://main.xxxx.amplifyapp.com/`
8. Under **Rewrites and redirects**, ensure single-page app routing is configured:
   - Source: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>`
   - Target: `/index.html`
   - Status: `200 (Rewrite)`
9. Click **Save and deploy**.

### Option B: Amazon S3 + CloudFront Deployment
1. Build the production assets:
   ```powershell
   npm run build
   ```
2. Create an Amazon S3 bucket with static website hosting or CloudFront Origin Access Control (OAC).
3. Sync the `dist/` folder:
   ```powershell
   aws s3 sync dist/ s3://your-auth-app-bucket --delete
   ```
4. Point a CloudFront distribution with HTTPS (SSL/TLS certificate from ACM) to the S3 bucket with custom error responses routing 403/404 to `/index.html`.
