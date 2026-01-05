

import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { 
  SignupRequest, 
  LoginRequest, 
  RefreshRequest, 
  AuthResponse, 
  RefreshResponse 
} from '../types';

export interface UpdateProfileRequest {
  name?: string;
  specialty?: string;
  clinic_name?: string; // Note: API may accept this as an alias or custom field
  medical_registration_number?: string;
  experience?: string | number; // API expects string, we'll convert number to string
  location?: string;
}

export interface DoctorProfile {
  id: number;
  name: string;
  specialty: string;
  email: string;
  clinic_name?: string;
  medical_registration_number?: string;
  experience?: number;
  location?: string;
  created_at: string;
}

class AuthService {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1${API_ENDPOINTS.SIGNUP}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Signup failed');
      }

      const apiResponse = await response.json();
      
      // API returns 'user' but our code expects 'doctor' - map it
      const userData = apiResponse.user || apiResponse.doctor;
      
      // Normalize the user data to match our expected structure
      const normalizedDoctor = {
        ...userData,
        // Handle experience - API might return as string, convert to number
        experience: typeof userData.experience === 'string' 
          ? parseInt(userData.experience, 10) || null 
          : userData.experience,
        // Ensure clinic_name exists (might be null/undefined from API)
        clinic_name: userData.clinic_name || null,
      };
      
      return {
        access_token: apiResponse.access_token,
        refresh_token: apiResponse.refresh_token,
        token_type: 'bearer',
        doctor: normalizedDoctor,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const apiResponse = await response.json();
      
      // API returns 'user' but our code expects 'doctor' - map it
      const userData = apiResponse.user || apiResponse.doctor;
      
      // Normalize the user data to match our expected structure
      const normalizedDoctor = {
        ...userData,
        // Handle experience - API might return as string, convert to number
        experience: typeof userData.experience === 'string' 
          ? parseInt(userData.experience, 10) || null 
          : userData.experience,
        // Ensure clinic_name exists (might be null/undefined from API)
        clinic_name: userData.clinic_name || null,
      };
      
      return {
        access_token: apiResponse.access_token,
        refresh_token: apiResponse.refresh_token,
        token_type: 'bearer',
        doctor: normalizedDoctor,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      // API expects refresh_token as query parameter, not in body
      const url = `${API_BASE_URL}/api/v1${API_ENDPOINTS.LOGOUT}?refresh_token=${encodeURIComponent(refreshToken)}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Logout warning:', await response.text());
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1${API_ENDPOINTS.REFRESH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Token refresh failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  async updateProfile(
    accessToken: string, 
    data: UpdateProfileRequest
  ): Promise<DoctorProfile> {
    try {
      const url = `${API_BASE_URL}/api/v1/auth/profile`;
      const requestBody = JSON.stringify(data);
      
      console.log('📤 Updating profile:', {
        url,
        data,
        hasAccessToken: !!accessToken,
      });
      
      // API expects JSON body, not query parameters
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: requestBody,
      });
      
      console.log('📥 Profile update response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        let errorMessage = 'Profile update failed';
        
        try {
          const errorData = await response.json();
          
          // Handle validation errors (422) - extract detail array
          if (errorData.detail && Array.isArray(errorData.detail)) {
            const errorMessages = errorData.detail.map((err: any) => {
              const field = err.loc?.join('.') || 'field';
              return `${field}: ${err.msg}`;
            });
            errorMessage = errorMessages.join('\n');
          } else if (errorData.detail) {
            errorMessage = typeof errorData.detail === 'string' 
              ? errorData.detail 
              : JSON.stringify(errorData.detail);
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
          } catch (textError) {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        }
        
        console.error('Profile update failed:', {
          status: response.status,
          statusText: response.statusText,
          errorMessage,
        });
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      // If it's already an Error with a message, re-throw it
      if (error instanceof Error) {
        console.error('Profile update error:', error.message);
        throw error;
      }
      
      // Otherwise, create a proper error message
      const errorMessage = error && typeof error === 'object' 
        ? JSON.stringify(error) 
        : String(error || 'Unknown error occurred');
      
      console.error('Profile update error:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export const authService = new AuthService();