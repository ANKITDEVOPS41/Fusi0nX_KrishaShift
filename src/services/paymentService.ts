import axios from 'axios';
import CryptoJS from 'crypto-js';
import { config } from '@/lib/config';

export interface PaymentRequest {
  amount: number;
  currency: 'INR';
  orderId: string;
  description: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  orderId: string;
  amount: number;
  status: 'created' | 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  gateway: 'razorpay' | 'payu' | 'stripe' | 'upi';
  transactionId?: string;
  gatewayResponse?: any;
  error?: string;
}

export interface UPIPayment {
  vpa: string; // Virtual Payment Address
  amount: number;
  note: string;
  merchantId: string;
  transactionRef: string;
}

export interface BankTransfer {
  accountNumber: string;
  ifsc: string;
  beneficiaryName: string;
  amount: number;
  purpose: string;
  reference: string;
}

export interface PaymentHistory {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentResponse['status'];
  gateway: PaymentResponse['gateway'];
  createdAt: Date;
  completedAt?: Date;
  description: string;
  customerInfo: PaymentRequest['customerInfo'];
  metadata?: Record<string, any>;
}

export interface RefundRequest {
  paymentId: string;
  amount?: number; // Partial refund if specified
  reason: string;
  notes?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
  paymentId: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  estimatedSettlement?: Date;
  error?: string;
}

class PaymentService {
  private razorpayInstance: any = null;
  private stripeInstance: any = null;

  constructor() {
    this.initializeGateways();
  }

  // Initialize payment gateways
  private async initializeGateways(): Promise<void> {
    try {
      // Initialize Razorpay
      if (typeof window !== 'undefined' && config.payments.razorpay.keyId) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          this.razorpayInstance = (window as any).Razorpay;
        };
        document.head.appendChild(script);
      }

      // Initialize Stripe
      if (config.payments.stripe.publishableKey) {
        const stripeScript = document.createElement('script');
        stripeScript.src = 'https://js.stripe.com/v3/';
        stripeScript.onload = () => {
          this.stripeInstance = (window as any).Stripe(config.payments.stripe.publishableKey);
        };
        document.head.appendChild(stripeScript);
      }
    } catch (error) {
      console.error('Error initializing payment gateways:', error);
    }
  }

  // Create payment order
  async createPaymentOrder(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/api/payments/create`, {
        ...request,
        timestamp: Date.now(),
        checksum: this.generateChecksum(request),
      });

      return response.data;
    } catch (error: any) {
      console.error('Error creating payment order:', error);
      return {
        success: false,
        paymentId: '',
        orderId: request.orderId,
        amount: request.amount,
        status: 'failed',
        gateway: 'razorpay',
        error: error.message,
      };
    }
  }

  // Process payment with Razorpay
  async processRazorpayPayment(
    paymentOrder: PaymentResponse,
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    return new Promise((resolve) => {
      if (!this.razorpayInstance) {
        resolve({
          ...paymentOrder,
          success: false,
          status: 'failed',
          error: 'Razorpay not initialized',
        });
        return;
      }

      const options = {
        key: config.payments.razorpay.keyId,
        amount: request.amount * 100, // Convert to paise
        currency: request.currency,
        name: 'Krishi Shift',
        description: request.description,
        order_id: paymentOrder.paymentId,
        image: '/icons/icon-192x192.png',
        prefill: {
          name: request.customerInfo.name,
          email: request.customerInfo.email,
          contact: request.customerInfo.phone,
        },
        theme: {
          color: '#22c55e',
        },
        modal: {
          ondismiss: () => {
            resolve({
              ...paymentOrder,
              success: false,
              status: 'cancelled',
              error: 'Payment cancelled by user',
            });
          },
        },
        handler: async (response: any) => {
          try {
            // Verify payment on server
            const verification = await this.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            resolve({
              ...paymentOrder,
              success: verification.success,
              status: verification.success ? 'completed' : 'failed',
              transactionId: response.razorpay_payment_id,
              gatewayResponse: response,
              error: verification.error,
            });
          } catch (error: any) {
            resolve({
              ...paymentOrder,
              success: false,
              status: 'failed',
              error: error.message,
            });
          }
        },
      };

      const rzp = new this.razorpayInstance(options);
      rzp.open();
    });
  }

  // Process payment with PayU
  async processPayUPayment(
    paymentOrder: PaymentResponse,
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    try {
      // Generate PayU hash
      const hashString = `${config.payments.payU.merchantKey}|${request.orderId}|${request.amount}|${request.description}|${request.customerInfo.name}|${request.customerInfo.email}|||||||||||${config.payments.payU.salt}`;
      const hash = CryptoJS.SHA512(hashString).toString();

      // Create form data
      const formData = {
        key: config.payments.payU.merchantKey,
        txnid: request.orderId,
        amount: request.amount,
        productinfo: request.description,
        firstname: request.customerInfo.name,
        email: request.customerInfo.email,
        phone: request.customerInfo.phone,
        surl: `${window.location.origin}/payment/success`,
        furl: `${window.location.origin}/payment/failure`,
        hash: hash,
        service_provider: 'payu_paisa',
      };

      // Submit form to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://secure.payu.in/_payment';

      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value.toString();
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      return {
        ...paymentOrder,
        success: true,
        status: 'pending',
        gateway: 'payu',
      };
    } catch (error: any) {
      return {
        ...paymentOrder,
        success: false,
        status: 'failed',
        error: error.message,
      };
    }
  }

  // Process payment with Stripe
  async processStripePayment(
    paymentOrder: PaymentResponse,
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    try {
      if (!this.stripeInstance) {
        throw new Error('Stripe not initialized');
      }

      // Create payment intent on server
      const response = await axios.post(`${config.api.baseUrl}/api/payments/stripe/create-intent`, {
        amount: request.amount * 100, // Convert to paise
        currency: request.currency.toLowerCase(),
        orderId: request.orderId,
        customerInfo: request.customerInfo,
      });

      const { client_secret } = response.data;

      // Confirm payment with Stripe
      const result = await this.stripeInstance.confirmCardPayment(client_secret, {
        payment_method: {
          card: {
            // This would be provided by Stripe Elements
          },
          billing_details: {
            name: request.customerInfo.name,
            email: request.customerInfo.email,
            phone: request.customerInfo.phone,
          },
        },
      });

      if (result.error) {
        return {
          ...paymentOrder,
          success: false,
          status: 'failed',
          error: result.error.message,
        };
      }

      return {
        ...paymentOrder,
        success: true,
        status: 'completed',
        gateway: 'stripe',
        transactionId: result.paymentIntent.id,
        gatewayResponse: result.paymentIntent,
      };
    } catch (error: any) {
      return {
        ...paymentOrder,
        success: false,
        status: 'failed',
        error: error.message,
      };
    }
  }

  // Process UPI payment
  async processUPIPayment(upiPayment: UPIPayment): Promise<PaymentResponse> {
    try {
      // Generate UPI deep link
      const upiUrl = `upi://pay?pa=${upiPayment.vpa}&pn=Krishi%20Shift&am=${upiPayment.amount}&cu=INR&tn=${encodeURIComponent(upiPayment.note)}&tr=${upiPayment.transactionRef}`;

      // Check if UPI apps are available
      if (this.isUPIAvailable()) {
        // Open UPI app
        window.location.href = upiUrl;
        
        // Return pending status - actual verification happens via webhook
        return {
          success: true,
          paymentId: upiPayment.transactionRef,
          orderId: upiPayment.transactionRef,
          amount: upiPayment.amount,
          status: 'pending',
          gateway: 'upi',
        };
      } else {
        // Show QR code for UPI payment
        const qrCodeUrl = await this.generateUPIQRCode(upiUrl);
        
        return {
          success: true,
          paymentId: upiPayment.transactionRef,
          orderId: upiPayment.transactionRef,
          amount: upiPayment.amount,
          status: 'pending',
          gateway: 'upi',
          metadata: { qrCodeUrl },
        };
      }
    } catch (error: any) {
      return {
        success: false,
        paymentId: '',
        orderId: upiPayment.transactionRef,
        amount: upiPayment.amount,
        status: 'failed',
        gateway: 'upi',
        error: error.message,
      };
    }
  }

  // Process bank transfer
  async processBankTransfer(transfer: BankTransfer): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/api/payments/bank-transfer`, {
        ...transfer,
        timestamp: Date.now(),
      });

      return {
        success: true,
        paymentId: response.data.transferId,
        orderId: transfer.reference,
        amount: transfer.amount,
        status: 'pending',
        gateway: 'upi', // Using UPI as generic for bank transfers
        metadata: {
          estimatedSettlement: response.data.estimatedSettlement,
          trackingNumber: response.data.trackingNumber,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        paymentId: '',
        orderId: transfer.reference,
        amount: transfer.amount,
        status: 'failed',
        gateway: 'upi',
        error: error.message,
      };
    }
  }

  // Verify Razorpay payment
  private async verifyRazorpayPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/api/payments/razorpay/verify`, paymentData);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/api/payments/${paymentId}/status`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }

  // Get payment history
  async getPaymentHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<PaymentHistory[]> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/api/payments/history`, {
        params: { userId, limit, offset },
      });
      
      return response.data.payments || [];
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  // Process refund
  async processRefund(refundRequest: RefundRequest): Promise<RefundResponse> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/api/payments/refund`, refundRequest);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        refundId: '',
        paymentId: refundRequest.paymentId,
        amount: refundRequest.amount || 0,
        status: 'failed',
        error: error.message,
      };
    }
  }

  // Generate payment receipt
  async generateReceipt(paymentId: string): Promise<Blob> {
    try {
      const response = await axios.get(`${config.api.baseUrl}/api/payments/${paymentId}/receipt`, {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to generate receipt: ${error.message}`);
    }
  }

  // Validate payment amount and details
  validatePaymentRequest(request: PaymentRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (request.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (request.amount > 200000) {
      errors.push('Amount cannot exceed ₹2,00,000');
    }

    if (!request.orderId || request.orderId.length < 3) {
      errors.push('Order ID is required and must be at least 3 characters');
    }

    if (!request.customerInfo.name) {
      errors.push('Customer name is required');
    }

    if (!request.customerInfo.email || !this.isValidEmail(request.customerInfo.email)) {
      errors.push('Valid email is required');
    }

    if (!request.customerInfo.phone || !this.isValidPhone(request.customerInfo.phone)) {
      errors.push('Valid phone number is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // Check if UPI is available on device
  private isUPIAvailable(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
    
    return isAndroid || isIOS;
  }

  // Generate UPI QR code
  private async generateUPIQRCode(upiUrl: string): Promise<string> {
    try {
      const response = await axios.post(`${config.api.baseUrl}/api/payments/upi/qr-code`, {
        upiUrl,
      });
      
      return response.data.qrCodeUrl;
    } catch (error) {
      console.error('Error generating UPI QR code:', error);
      return '';
    }
  }

  // Generate checksum for security
  private generateChecksum(request: PaymentRequest): string {
    const data = `${request.orderId}|${request.amount}|${request.customerInfo.email}|${Date.now()}`;
    return CryptoJS.SHA256(data).toString();
  }

  // Validate email format
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone number format
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  // Encrypt sensitive data
  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, config.security.encryption.algorithm).toString();
  }

  // Decrypt sensitive data
  private decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, config.security.encryption.algorithm);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Handle payment webhook (for server-side verification)
  async handleWebhook(webhookData: any, signature: string): Promise<boolean> {
    try {
      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(webhookData, signature);
      
      if (!isValid) {
        console.error('Invalid webhook signature');
        return false;
      }

      // Process webhook based on event type
      switch (webhookData.event) {
        case 'payment.captured':
          await this.handlePaymentSuccess(webhookData.payload);
          break;
        case 'payment.failed':
          await this.handlePaymentFailure(webhookData.payload);
          break;
        case 'refund.processed':
          await this.handleRefundProcessed(webhookData.payload);
          break;
        default:
          console.log('Unhandled webhook event:', webhookData.event);
      }

      return true;
    } catch (error) {
      console.error('Error handling webhook:', error);
      return false;
    }
  }

  // Verify webhook signature
  private verifyWebhookSignature(data: any, signature: string): boolean {
    const expectedSignature = CryptoJS.HmacSHA256(
      JSON.stringify(data),
      config.payments.razorpay.keySecret
    ).toString();
    
    return signature === expectedSignature;
  }

  // Handle successful payment
  private async handlePaymentSuccess(paymentData: any): Promise<void> {
    try {
      await axios.post(`${config.api.baseUrl}/api/payments/webhook/success`, paymentData);
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  }

  // Handle failed payment
  private async handlePaymentFailure(paymentData: any): Promise<void> {
    try {
      await axios.post(`${config.api.baseUrl}/api/payments/webhook/failure`, paymentData);
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  // Handle processed refund
  private async handleRefundProcessed(refundData: any): Promise<void> {
    try {
      await axios.post(`${config.api.baseUrl}/api/payments/webhook/refund`, refundData);
    } catch (error) {
      console.error('Error handling refund processed:', error);
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;