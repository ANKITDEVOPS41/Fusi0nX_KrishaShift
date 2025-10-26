import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPhoneNumber, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { SignJWT, jwtVerify } from 'jose';
import CryptoJS from 'crypto-js';
import { config } from '@/lib/config';
import { useAuthStore } from '@/stores/authStore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: config.auth.firebase.apiKey,
  authDomain: config.auth.firebase.authDomain,
  projectId: config.auth.firebase.projectId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// JWT Secret (in production, this should be from environment)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'krishi-shift-secret-key-2024'
);

export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface RegisterData {
  email: string;
  phone: string;
  password: string;
  name: string;
  role: 'farmer' | 'fpo_manager' | 'extension_worker';
  location?: {
    state: string;
    district: string;
    block: string;
    village: string;
    coordinates: [number, number];
  };
}

export interface BiometricData {
  type: 'fingerprint' | 'face' | 'voice';
  template: string;
  confidence: number;
}

class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;

  constructor() {
    // Listen to auth state changes
    onAuthStateChanged(auth, this.handleAuthStateChange.bind(this));
  }

  // Initialize reCAPTCHA for phone authentication
  initializeRecaptcha(containerId: string = 'recaptcha-container'): void {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.recaptchaVerifier = null;
        }
      });
    }
  }

  // Phone number authentication
  async sendOTP(phoneNumber: string): Promise<boolean> {
    try {
      if (!this.recaptchaVerifier) {
        this.initializeRecaptcha();
      }

      const formattedPhone = phoneNumber.startsWith('+91') 
        ? phoneNumber 
        : `+91${phoneNumber}`;

      this.confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        this.recaptchaVerifier!
      );

      return true;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  }

  // Verify OTP and complete phone authentication
  async verifyOTP(otp: string): Promise<User> {
    try {
      if (!this.confirmationResult) {
        throw new Error('No OTP request found. Please request OTP first.');
      }

      const result = await this.confirmationResult.confirm(otp);
      return result.user;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('Invalid OTP. Please try again.');
    }
  }

  // Email/Password authentication
  async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      console.error('Error logging in with email:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No account found with this email.');
        case 'auth/wrong-password':
          throw new Error('Incorrect password.');
        case 'auth/invalid-email':
          throw new Error('Invalid email address.');
        case 'auth/user-disabled':
          throw new Error('This account has been disabled.');
        default:
          throw new Error('Login failed. Please try again.');
      }
    }
  }

  // Google OAuth authentication
  async loginWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error: any) {
      console.error('Error logging in with Google:', error);
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          throw new Error('Login cancelled by user.');
        case 'auth/popup-blocked':
          throw new Error('Popup blocked. Please allow popups and try again.');
        default:
          throw new Error('Google login failed. Please try again.');
      }
    }
  }

  // Register new user
  async register(data: RegisterData): Promise<User> {
    try {
      // Create user with email/password
      const result = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );

      // Update profile with name
      await updateProfile(result.user, {
        displayName: data.name
      });

      // Send email verification
      await sendEmailVerification(result.user);

      // Create user profile in database
      await this.createUserProfile(result.user, data);

      return result.user;
    } catch (error: any) {
      console.error('Error registering user:', error);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('An account with this email already exists.');
        case 'auth/weak-password':
          throw new Error('Password is too weak. Please use at least 6 characters.');
        case 'auth/invalid-email':
          throw new Error('Invalid email address.');
        default:
          throw new Error('Registration failed. Please try again.');
      }
    }
  }

  // Biometric authentication
  async enableBiometric(type: BiometricData['type']): Promise<boolean> {
    try {
      if (!('credentials' in navigator)) {
        throw new Error('Biometric authentication not supported');
      }

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: 'Krishi Shift',
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(auth.currentUser?.uid || ''),
            name: auth.currentUser?.email || '',
            displayName: auth.currentUser?.displayName || '',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'direct',
        },
      }) as PublicKeyCredential;

      if (credential) {
        // Store biometric data securely
        const biometricData: BiometricData = {
          type,
          template: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
          confidence: 0.95
        };

        await this.storeBiometricData(biometricData);
        useAuthStore.getState().enableBiometric();
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      throw new Error('Failed to enable biometric authentication');
    }
  }

  // Authenticate with biometrics
  async authenticateWithBiometric(): Promise<boolean> {
    try {
      if (!('credentials' in navigator)) {
        throw new Error('Biometric authentication not supported');
      }

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          userVerification: 'required',
        },
      }) as PublicKeyCredential;

      return !!credential;
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return false;
    }
  }

  // Two-Factor Authentication
  async enableTwoFactor(): Promise<string> {
    try {
      // Generate TOTP secret
      const secret = this.generateTOTPSecret();
      
      // Store encrypted secret
      await this.storeTwoFactorSecret(secret);
      
      useAuthStore.getState().enableTwoFactor();
      
      // Return QR code data
      const user = auth.currentUser;
      const qrData = `otpauth://totp/Krishi%20Shift:${user?.email}?secret=${secret}&issuer=Krishi%20Shift`;
      
      return qrData;
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      throw new Error('Failed to enable two-factor authentication');
    }
  }

  // Verify TOTP code
  async verifyTOTP(code: string): Promise<boolean> {
    try {
      const secret = await this.getTwoFactorSecret();
      if (!secret) return false;

      const isValid = this.validateTOTP(code, secret);
      return isValid;
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      return false;
    }
  }

  // Generate JWT tokens
  async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const now = Math.floor(Date.now() / 1000);
    
    const accessToken = await new SignJWT({
      uid: user.uid,
      email: user.email,
      role: 'farmer', // This should come from user profile
      type: 'access'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + config.auth.jwt.accessTokenExpiry)
      .sign(JWT_SECRET);

    const refreshToken = await new SignJWT({
      uid: user.uid,
      type: 'refresh'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + config.auth.jwt.refreshTokenExpiry)
      .sign(JWT_SECRET);

    return { accessToken, refreshToken };
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<any> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Invalid token');
    }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const payload = await this.verifyToken(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      const user = auth.currentUser;
      if (!user || user.uid !== payload.uid) {
        throw new Error('User mismatch');
      }

      const { accessToken } = await this.generateTokens(user);
      return accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Failed to refresh token');
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      useAuthStore.getState().logout();
    } catch (error) {
      console.error('Error logging out:', error);
      throw new Error('Logout failed');
    }
  }

  // Handle auth state changes
  private async handleAuthStateChange(user: User | null): Promise<void> {
    const authStore = useAuthStore.getState();
    
    if (user) {
      // User is signed in
      authStore.setUser(user);
      
      // Generate tokens
      const tokens = await this.generateTokens(user);
      authStore.setTokens(tokens.accessToken, tokens.refreshToken);
      
      // Load user profile
      await this.loadUserProfile(user.uid);
    } else {
      // User is signed out
      authStore.setUser(null);
    }
  }

  // Create user profile in database
  private async createUserProfile(user: User, data: RegisterData): Promise<void> {
    try {
      const profile = {
        id: user.uid,
        email: data.email,
        phone: data.phone,
        name: data.name,
        role: data.role,
        location: data.location,
        kycStatus: 'pending' as const,
        isActive: true,
        lastLogin: new Date(),
        preferences: {
          language: 'en',
          notifications: {
            priceAlerts: true,
            weatherAlerts: true,
            schemeUpdates: true,
            fpoNotifications: true,
          },
          theme: 'system' as const,
        },
        gamification: {
          points: 0,
          badges: [],
          level: 1,
          achievements: [],
        },
      };

      // Store in Supabase or your database
      // await supabase.from('user_profiles').insert(profile);
      
      useAuthStore.getState().setProfile(profile);
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  // Load user profile from database
  private async loadUserProfile(uid: string): Promise<void> {
    try {
      // Load from Supabase or your database
      // const { data } = await supabase.from('user_profiles').select('*').eq('id', uid).single();
      
      // For now, create a mock profile
      const profile = {
        id: uid,
        email: auth.currentUser?.email || '',
        phone: auth.currentUser?.phoneNumber || '',
        name: auth.currentUser?.displayName || '',
        role: 'farmer' as const,
        kycStatus: 'pending' as const,
        isActive: true,
        lastLogin: new Date(),
        preferences: {
          language: 'en',
          notifications: {
            priceAlerts: true,
            weatherAlerts: true,
            schemeUpdates: true,
            fpoNotifications: true,
          },
          theme: 'system' as const,
        },
        gamification: {
          points: 0,
          badges: [],
          level: 1,
          achievements: [],
        },
      };

      useAuthStore.getState().setProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  // Store biometric data securely
  private async storeBiometricData(data: BiometricData): Promise<void> {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data), 
      config.security.encryption.algorithm
    ).toString();
    
    localStorage.setItem('krishi_biometric', encrypted);
  }

  // Generate TOTP secret
  private generateTOTPSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  // Store 2FA secret securely
  private async storeTwoFactorSecret(secret: string): Promise<void> {
    const encrypted = CryptoJS.AES.encrypt(
      secret, 
      config.security.encryption.algorithm
    ).toString();
    
    localStorage.setItem('krishi_2fa_secret', encrypted);
  }

  // Get 2FA secret
  private async getTwoFactorSecret(): Promise<string | null> {
    try {
      const encrypted = localStorage.getItem('krishi_2fa_secret');
      if (!encrypted) return null;

      const decrypted = CryptoJS.AES.decrypt(
        encrypted, 
        config.security.encryption.algorithm
      ).toString(CryptoJS.enc.Utf8);
      
      return decrypted;
    } catch (error) {
      console.error('Error getting 2FA secret:', error);
      return null;
    }
  }

  // Validate TOTP code
  private validateTOTP(code: string, secret: string): boolean {
    // Implementation of TOTP validation
    // This is a simplified version - use a proper TOTP library in production
    const timeStep = Math.floor(Date.now() / 1000 / 30);
    
    // Check current time step and ±1 for clock skew
    for (let i = -1; i <= 1; i++) {
      const expectedCode = this.generateTOTP(secret, timeStep + i);
      if (code === expectedCode) {
        return true;
      }
    }
    
    return false;
  }

  // Generate TOTP code
  private generateTOTP(secret: string, timeStep: number): string {
    // Simplified TOTP generation - use a proper library in production
    const hash = CryptoJS.HmacSHA1(timeStep.toString(), secret);
    const offset = parseInt(hash.toString().slice(-1), 16);
    const code = parseInt(hash.toString().substr(offset * 2, 8), 16) % 1000000;
    return code.toString().padStart(6, '0');
  }
}

export const authService = new AuthService();
export default authService;