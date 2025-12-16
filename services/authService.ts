// // services/authService.ts

// import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
// import { 
//   SignupRequest, 
//   LoginRequest, 
//   RefreshRequest, 
//   AuthResponse, 
//   RefreshResponse 
// } from '../types';

// class AuthService {
//   async signup(data: SignupRequest): Promise<AuthResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.detail || 'Signup failed');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   }

//   async login(data: LoginRequest): Promise<AuthResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.detail || 'Login failed');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   }

// async logout(refreshToken: string): Promise<void> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ refresh_token: refreshToken }),
//       });

//       if (!response.ok) {
//         console.warn('Logout warning:', await response.text());
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//       // Don't throw - allow local logout even if API fails
//     }
//   }

//   async refreshToken(refreshToken: string): Promise<RefreshResponse> {
//     try {
//       const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.REFRESH}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ refresh_token: refreshToken }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.detail || 'Token refresh failed');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Token refresh error:', error);
//       throw error;
//     }
//   }
// }

// export const authService = new AuthService();




// services/authService.ts

import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import { 
  SignupRequest, 
  LoginRequest, 
  RefreshRequest, 
  AuthResponse, 
  RefreshResponse 
} from '../types';

export interface UpdateProfileRequest {
  clinic_name?: string;
  medical_registration_number?: string;
  experience?: number;
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

      return await response.json();
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

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1${API_ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
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
      // Build query parameters from the data
      const queryParams = new URLSearchParams();
      
      if (data.clinic_name) queryParams.append('clinic_name', data.clinic_name);
      if (data.medical_registration_number) {
        queryParams.append('medical_registration_number', data.medical_registration_number);
      }
      if (data.experience !== undefined) {
        queryParams.append('experience', data.experience.toString());
      }
      if (data.location) queryParams.append('location', data.location);

      const url = `${API_BASE_URL}/api/v1/auth/profile?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Profile update failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();