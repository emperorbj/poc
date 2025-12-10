// types/index.ts

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
  time: string;
}

export interface SessionSummary {
  identifiers: string;
  history: string;
  examination: string;
  diagnosis: string;
  treatment: string;
  nextSteps: string;
}

export interface Consultation {
  id: string;
  patient: Patient;
  status: 'Pending' | 'Completed';
  transcription?: string;
  sessionSummary?: SessionSummary;
  prescription?: string;
  reviewed: boolean;
}

export interface TenantDetails {
  locationName: string;
  specialty: string;
  clinicName: string;
  doctorName: string;
}

export type FilterType = 'All' | 'Pending' | 'Completed';