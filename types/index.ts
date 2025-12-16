export interface Prescription {
  treatment: Array<{
    name: string;
    dosage: string;
    duration: string;
  }>;
  advice: string[];
  nextSteps: string[];
}
export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  patientType: 'New' | 'Existing';
  presentingComplaint: string;
  urgency: 'High' | 'Medium' | 'Low';
  whatsappNumber: string;
  aadharId: string;
  country:string,
  state:string,
  city:string,
  time: string;
}
export interface SessionSummary {
  identifiers: string;  // Keep as string (not a list)
  history: string[];    // Change to array
  examination: string[]; // Change to array
  diagnosis: string[];   // Change to array
  treatment: string[];   // Change to array
  nextSteps: string[];   // Change to array
}


export interface Consultation {
  id: string;
  patient: Patient;
  status: 'Pending' | 'Completed';
  transcription?: string;
  sessionSummary?: SessionSummary;
  prescription?: Prescription;
  reviewed: boolean;
}




export interface TenantDetails {
  locationName: string;
  specialty: string;
  clinicName: string;
  doctorName: string;
  medicalRegistrationNumber: string,
  yearsOfExperience: string,
}

export interface UserRegistration {
  doctorName: string;
  specialty: string;
  email: string;
  password: string;
}

export type FilterType = 'All' | 'Pending' | 'Completed';


export interface SignupRequest {
  name: string;
  specialty: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  doctor: {
    id: number;
    name: string;
    specialty: string;
    email: string;
    created_at: string;
  };
}

export interface RefreshResponse {
  access_token: string;
  token_type: 'bearer';
}