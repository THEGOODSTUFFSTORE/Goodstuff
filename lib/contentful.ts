import { createClient } from 'contentful';

// Check if we're on the server side
if (typeof window !== 'undefined') {
  throw new Error('Contentful client should only be used on the server side');
}

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!spaceId || !accessToken) {
  throw new Error(
    `Missing Contentful environment variables:
    CONTENTFUL_SPACE_ID: ${spaceId ? '✓' : '✗'}
    CONTENTFUL_ACCESS_TOKEN: ${accessToken ? '✓' : '✗'}`
  );
}

const client = createClient({
  space: spaceId,
  accessToken: accessToken,
  environment: environment,
});

export default client;