// store/useStore.ts

import { create } from 'zustand';
import { Patient, Consultation, TenantDetails } from '../types';

interface AppState {
  isAuthenticated: boolean;
  tenantDetails: TenantDetails | null;
  consultations: Consultation[];
  currentConsultation: Consultation | null;
  
  // Actions
  login: (email: string, password: string) => void;
  logout: () => void;
  setTenantDetails: (details: TenantDetails) => void;
  addConsultation: (patient: Patient) => void;
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
  setCurrentConsultation: (consultation: Consultation | null) => void;
  reorderConsultations: (consultations: Consultation[]) => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  tenantDetails: null,
  consultations: [
    {
      id: '1',
      patient: {
        id: '1',
        name: 'Mary John',
        age: 32,
        sex: 'Female',
        patientType: 'New',
        presentingComplaint: 'Missed cycles',
        urgency: 'Medium',
        whatsappNumber: '+919876543210',
        aadharId: '1234-5678-9012',
        time: '2:30PM',
      },
      status: 'Pending',
      reviewed: false,
    },
    {
      id: '2',
      patient: {
        id: '2',
        name: 'Sarah Williams',
        age: 28,
        sex: 'Female',
        patientType: 'Existing',
        presentingComplaint: 'Follow-up',
        urgency: 'Low',
        whatsappNumber: '+919876543211',
        aadharId: '2234-5678-9012',
        time: '3:00PM',
      },
      status: 'Pending',
      reviewed: false,
    },
  ],
  currentConsultation: null,

  login: (email, password) => {
    // TODO: Implement actual authentication
    set({ isAuthenticated: true });
  },

  logout: () => {
    set({ isAuthenticated: false, tenantDetails: null });
  },

  setTenantDetails: (details) => {
    set({ tenantDetails: details });
  },

  addConsultation: (patient) =>
    set((state) => ({
      consultations: [
        ...state.consultations,
        {
          id: Date.now().toString(),
          patient,
          status: 'Pending',
          reviewed: false,
        },
      ],
    })),

  updateConsultation: (id, updates) =>
    set((state) => ({
      consultations: state.consultations.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  setCurrentConsultation: (consultation) =>
    set({ currentConsultation: consultation }),

  reorderConsultations: (consultations) =>
    set({ consultations }),
}));