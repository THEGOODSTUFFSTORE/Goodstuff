# Environment Setup for Firebase

## For Development

Create a `.env.local` file in the root directory with the following variables:

```
FIREBASE_PROJECT_ID=thegoodstuffdelivery
FIREBASE_PRIVATE_KEY_ID=4461bccc9d754e28b2f31ef1854bb5a893d841d3
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@thegoodstuffdelivery.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=104849244051365820577
```

**Important Notes:**
- The private key should be enclosed in quotes
- Keep the `\n` characters in the private key as literal text
- Copy the actual private key from your `firebase-service-account.json.json` file

## For Production Deployment

### Vercel
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add each of the variables above

### Other Platforms
Set the same environment variables in your deployment platform's environment variable configuration.

## Fallback Behavior

The application will:
1. First try to use environment variables (recommended for production)
2. Fall back to the local `firebase-service-account.json.json` file (development only)
3. Throw an error if neither is available

This ensures your credentials are never committed to version control while still allowing local development. 