import { PesapalPaymentRequest, PesapalPaymentResponse, PesapalPaymentStatus } from './types';

class PesapalAPI {
  private baseUrl: string;
  private consumerKey: string;
  private consumerSecret: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.PESAPAL_API_URL || 'https://pay.pesapal.com/v3';
    this.consumerKey = process.env.PESAPAL_CONSUMER_KEY || '';
    this.consumerSecret = process.env.PESAPAL_CONSUMER_SECRET || '';
  }

  private async getToken(): Promise<string> {
    if (this.token) return this.token;

    try {
      const response = await fetch(`${this.baseUrl}/api/Auth/RequestToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          consumer_key: this.consumerKey,
          consumer_secret: this.consumerSecret
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get Pesapal token');
      }

      const data = await response.json();
      this.token = data.token;
      return data.token as string;
    } catch (error) {
      console.error('Error getting Pesapal token:', error);
      throw error;
    }
  }

  async submitOrder(paymentRequest: PesapalPaymentRequest): Promise<PesapalPaymentResponse> {
    try {
      const token = await this.getToken();
      
      const response = await fetch(`${this.baseUrl}/api/Transactions/SubmitOrderRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to submit order to Pesapal');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting order to Pesapal:', error);
      throw error;
    }
  }

  async getTransactionStatus(orderTrackingId: string): Promise<PesapalPaymentStatus> {
    try {
      const token = await this.getToken();
      
      const response = await fetch(`${this.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get transaction status from Pesapal');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting transaction status from Pesapal:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const pesapalApi = new PesapalAPI(); 