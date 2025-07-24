import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';

export async function POST(request: NextRequest) {
  // Get the base URL (declare outside try block for error handling)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://goodstuff-five.vercel.app';
  const ipnUrl = `${baseUrl}/api/payments/pesapal/ipn`;

  try {
    // First check if basic credentials are available
    if (!process.env.PESAPAL_CONSUMER_KEY || !process.env.PESAPAL_CONSUMER_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Missing Pesapal API credentials',
        required: ['PESAPAL_CONSUMER_KEY', 'PESAPAL_CONSUMER_SECRET'],
        instructions: 'Please set these environment variables before proceeding'
      }, { status: 400 });
    }
    
    console.log('Auto-fixing Pesapal configuration...');
    console.log('Registering IPN URL:', ipnUrl);
    
    // Register the IPN URL with Pesapal
    const result = await pesapalApi.registerIPN(ipnUrl, 'GET');
    
    console.log('IPN Registration successful:', result);
    
    return NextResponse.json({
      success: true,
      ipn_id: result.ipn_id,
      ipn_url: ipnUrl,
      message: 'Pesapal configuration fixed successfully!',
      nextSteps: [
        `Add this to your environment variables: PESAPAL_IPN_ID=${result.ipn_id}`,
        'Restart your application after adding the environment variable',
        'Test checkout functionality'
      ],
      envVar: `PESAPAL_IPN_ID=${result.ipn_id}`
    });
    
  } catch (error) {
    console.error('Error auto-fixing Pesapal config:', error);
    
    // Provide specific error messages
    let errorMessage = 'Failed to register IPN URL';
    let suggestions = ['Check your Pesapal API credentials', 'Ensure your app URL is accessible from the internet'];
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        suggestions = ['Check your PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET', 'Ensure you are using the correct Pesapal environment (sandbox vs live)'];
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        suggestions = ['Check your internet connection', 'Verify Pesapal API is accessible'];
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      suggestions,
      troubleshooting: {
        credentials: {
          consumer_key_set: !!process.env.PESAPAL_CONSUMER_KEY,
          consumer_secret_set: !!process.env.PESAPAL_CONSUMER_SECRET
        },
        ipn_url: ipnUrl,
        base_url: baseUrl
      }
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Pesapal Configuration Fix Tool',
    instructions: 'Send a POST request to automatically register IPN URL and fix configuration',
    requirements: [
      'PESAPAL_CONSUMER_KEY must be set',
      'PESAPAL_CONSUMER_SECRET must be set',
      'NEXT_PUBLIC_APP_URL should be set (optional, defaults to production URL)'
    ]
  });
} 