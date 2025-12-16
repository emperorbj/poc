

// import * as SecureStore from 'expo-secure-store';

// const TOKEN_KEY = 'access_token';
// const REFRESH_TOKEN_KEY = 'refresh_token';
// const DOCTOR_KEY = 'doctor_data';
// const TENANT_KEY = 'tenant_details';

// export const tokenStorage = {
//   async setTokens(accessToken: string, refreshToken: string): Promise<void> {
//     try {
//       await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
//       await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
//     } catch (error) {
//       console.error('Error saving tokens:', error);
//       throw error;
//     }
//   },

//   async getAccessToken(): Promise<string | null> {
//     try {
//       return await SecureStore.getItemAsync(TOKEN_KEY);
//     } catch (error) {
//       console.error('Error getting access token:', error);
//       return null;
//     }
//   },

//   async getRefreshToken(): Promise<string | null> {
//     try {
//       return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
//     } catch (error) {
//       console.error('Error getting refresh token:', error);
//       return null;
//     }
//   },

//   async setDoctorData(doctor: any): Promise<void> {
//     try {
//       await SecureStore.setItemAsync(DOCTOR_KEY, JSON.stringify(doctor));
//     } catch (error) {
//       console.error('Error saving doctor data:', error);
//       throw error;
//     }
//   },

//   async getDoctorData(): Promise<any | null> {
//     try {
//       const data = await SecureStore.getItemAsync(DOCTOR_KEY);
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       console.error('Error getting doctor data:', error);
//       return null;
//     }
//   },

//   async setTenantDetails(tenantDetails: any): Promise<void> {
//     try {
//       await SecureStore.setItemAsync(TENANT_KEY, JSON.stringify(tenantDetails));
//     } catch (error) {
//       console.error('Error saving tenant details:', error);
//       throw error;
//     }
//   },

//   async getTenantDetails(): Promise<any | null> {
//     try {
//       const data = await SecureStore.getItemAsync(TENANT_KEY);
//       return data ? JSON.parse(data) : null;
//     } catch (error) {
//       console.error('Error getting tenant details:', error);
//       return null;
//     }
//   },

//   async clearAll(): Promise<void> {
//     try {
//       await SecureStore.deleteItemAsync(TOKEN_KEY);
//       await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
//       await SecureStore.deleteItemAsync(DOCTOR_KEY);
//       await SecureStore.deleteItemAsync(TENANT_KEY);
//     } catch (error) {
//       console.error('Error clearing tokens:', error);
//       throw error;
//     }
//   },
// };


// utils/tokenStorage.ts

import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const DOCTOR_KEY = 'doctor_data';
const TENANT_KEY = 'tenant_details';
const PROFILE_COMPLETE_KEY = 'profile_complete';

export const tokenStorage = {
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  },

  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async setDoctorData(doctor: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(DOCTOR_KEY, JSON.stringify(doctor));
      console.log('💾 Doctor data saved to SecureStore');
    } catch (error) {
      console.error('Error saving doctor data:', error);
      throw error;
    }
  },

  async getDoctorData(): Promise<any | null> {
    try {
      const data = await SecureStore.getItemAsync(DOCTOR_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting doctor data:', error);
      return null;
    }
  },

  async setTenantDetails(tenantDetails: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(TENANT_KEY, JSON.stringify(tenantDetails));
      console.log('💾 Tenant details saved to SecureStore');
    } catch (error) {
      console.error('Error saving tenant details:', error);
      throw error;
    }
  },

  async getTenantDetails(): Promise<any | null> {
    try {
      const data = await SecureStore.getItemAsync(TENANT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting tenant details:', error);
      return null;
    }
  },

  async setProfileComplete(isComplete: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(PROFILE_COMPLETE_KEY, JSON.stringify(isComplete));
      console.log('💾 Profile complete status saved:', isComplete);
    } catch (error) {
      console.error('Error saving profile complete status:', error);
      throw error;
    }
  },

  async getProfileComplete(): Promise<boolean> {
    try {
      const data = await SecureStore.getItemAsync(PROFILE_COMPLETE_KEY);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error getting profile complete status:', error);
      return false;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(DOCTOR_KEY);
      await SecureStore.deleteItemAsync(TENANT_KEY);
      await SecureStore.deleteItemAsync(PROFILE_COMPLETE_KEY);
      console.log('🗑️ All storage cleared');
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },
};