import { NextRequest, NextResponse } from 'next/server';
import { pesapalApi } from '@/lib/pesapal';

export async function POST(request: NextRequest) {
  try {
    // Get the base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const ipnUrl = `${baseUrl}/api/payments/pesapal/ipn`;
    
    console.log('Registering IPN URL:', ipnUrl);
    
    // Register the IPN URL with Pesapal using GET method
    const result = await pesapalApi.registerIPN(ipnUrl, 'GET');
    
    console.log('IPN Registration full response:', result);
    
    return NextResponse.json({
      success: true,
      ipn_id: result.ipn_id,
      ipn_url: ipnUrl,
      message: `Add PESAPAL_IPN_ID=${result.ipn_id} to your .env.local file`,
      full_response: result
    });
    
  } catch (error) {
    console.error('Error registering IPN:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to register IPN URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Use POST to register IPN URL',
    instructions: 'Send a POST request to this endpoint to register your IPN URL with Pesapal'
  });
} 