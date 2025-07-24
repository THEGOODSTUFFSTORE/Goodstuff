import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check all required environment variables
    const config = {
      PESAPAL_CONSUMER_KEY: !!process.env.PESAPAL_CONSUMER_KEY,
      PESAPAL_CONSUMER_SECRET: !!process.env.PESAPAL_CONSUMER_SECRET,
      PESAPAL_IPN_ID: !!process.env.PESAPAL_IPN_ID,
      PESAPAL_API_URL: process.env.PESAPAL_API_URL || 'https://pay.pesapal.com/v3',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'Not set',
    };

    const missingVars = Object.entries(config)
      .filter(([key, value]) => {
        if (key === 'PESAPAL_API_URL' || key === 'NEXT_PUBLIC_APP_URL') {
          return !value || value === 'Not set';
        }
        return !value;
      })
      .map(([key]) => key);

    const isConfigured = missingVars.length === 0;

    return NextResponse.json({
      configured: isConfigured,
      config: config,
      missing: missingVars,
      status: isConfigured ? 'Ready for payments' : 'Configuration incomplete',
      recommendations: isConfigured ? [] : [
        ...(missingVars.includes('PESAPAL_IPN_ID') ? ['Register IPN URL by calling POST /api/payments/pesapal/register-ipn'] : []),
        ...(missingVars.includes('PESAPAL_CONSUMER_KEY') || missingVars.includes('PESAPAL_CONSUMER_SECRET') ? ['Set Pesapal API credentials'] : []),
        ...(missingVars.includes('NEXT_PUBLIC_APP_URL') ? ['Set NEXT_PUBLIC_APP_URL environment variable'] : [])
      ]
    });
  } catch (error) {
    console.error('Error checking Pesapal config:', error);
    return NextResponse.json(
      { error: 'Failed to check configuration' },
      { status: 500 }
    );
  }
} 