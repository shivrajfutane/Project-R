import { Amplify } from 'aws-amplify';

/**
 * AWS Amplify Gen 2 / v6 Configuration
 * Reads public client parameters from Vite environment variables (VITE_ prefixed).
 * NOTE: Never expose AWS IAM secret keys in client-side code.
 */

const region = import.meta.env.VITE_AWS_REGION || 'ap-south-1';
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID || '';
const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || '';
const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN || '';
const redirectSignIn = import.meta.env.VITE_REDIRECT_SIGN_IN_URL || window.location.origin + '/dashboard';
const redirectSignOut = import.meta.env.VITE_REDIRECT_SIGN_OUT_URL || window.location.origin + '/';

/**
 * Checks if real AWS Cognito credentials are configured
 * @returns {boolean}
 */
export const isAwsConfigured = () => {
  return (
    typeof userPoolId === 'string' &&
    userPoolId.trim().length > 5 &&
    !userPoolId.includes('xxxx') &&
    typeof userPoolClientId === 'string' &&
    userPoolClientId.trim().length > 5 &&
    !userPoolClientId.includes('xxxx')
  );
};

export const awsConfigDetails = {
  region,
  userPoolId,
  userPoolClientId,
  cognitoDomain,
  redirectSignIn,
  redirectSignOut,
  isConfigured: isAwsConfigured(),
};

// Initialize Amplify if credentials exist
if (isAwsConfigured()) {
  try {
    const authConfig = {
      Auth: {
        Cognito: {
          userPoolId,
          userPoolClientId,
          signUpVerificationMethod: 'code',
          loginWith: {
            email: true,
            phone: true,
          },
        },
      },
    };

    // If Hosted UI / Federation domain is configured, add oauth config
    if (cognitoDomain) {
      authConfig.Auth.Cognito.loginWith.oauth = {
        domain: cognitoDomain.replace(/^https?:\/\//, ''),
        scopes: ['email', 'openid', 'phone', 'profile', 'aws.cognito.signin.user.admin'],
        redirectSignIn: [redirectSignIn],
        redirectSignOut: [redirectSignOut],
        responseType: 'code',
        providers: ['Google'],
      };
    }

    Amplify.configure(authConfig);
    console.info('[AWS Amplify] Initialized successfully with User Pool:', userPoolId);
  } catch (err) {
    console.error('[AWS Amplify] Configuration error:', err);
  }
} else {
  console.warn(
    '[AWS Amplify] Cognito User Pool credentials not found in .env. Running in Demo / Simulation mode until .env is configured.'
  );
}

export default Amplify;
