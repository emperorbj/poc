// // styles/commonStyles.ts

// import { StyleSheet } from 'react-native';

// export const colors = {
//   primary: '#2E37A4',
//   secondary: '#10B981',
//   danger: '#EF4444',
//   warning: '#F59E0B',
//   gray: {
//     50: '#F9FAFB',
//     100: '#F3F4F6',
//     200: '#E5E7EB',
//     300: '#D1D5DB',
//     400: '#9CA3AF',
//     500: '#6B7280',
//     600: '#4B5563',
//     700: '#374151',
//     800: '#1F2937',
//     900: '#111827',
//   },
//   white: '#FFFFFF',
//   blue: {
//     50: '#EFF6FF',
//     100: '#DBEAFE',
//   },
//   indigo: {
//     50: '#EEF2FF',
//     100: '#E0E7FF',
//   },
// };

// export const commonStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.gray[50],
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 100,
//     marginTop:10
//   },
//   button: {
//     backgroundColor: colors.primary,
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 24,
//   },
//   buttonText: {
//     color: colors.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   input: {
//     backgroundColor: colors.white,
//     borderWidth: 1,
//     borderColor: 'transparent',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     color: colors.gray[800],
//     flex:1
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: colors.gray[700],
//     marginBottom: 8,
//     marginTop: 16,
//   },
//   header: {
//     backgroundColor: colors.primary,
//     padding: 20,
//     paddingTop: 60,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     marginTop:20,
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.primary,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.gray[800],
//     marginBottom: 12,
//   },
//   card: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   centerContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: colors.white,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '90%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: colors.gray[800],
//   },
//   modalClose: {
//     fontSize: 24,
//     color: colors.gray[500],
//   },
//   row: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   halfWidth: {
//     flex: 1,
//   },
// });

// styles/commonStyles.ts

import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#2E37A4',
  secondary: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  white: '#FFFFFF',
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
  },
  indigo: {
    50: '#EEF2FF',
    100: '#E0E7FF',
  },
  green: {
    50: '#d4edda',
    100: '#c3e6cb',
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.gray[800],
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: 8,
    marginTop: 16,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray[800],
  },
  modalClose: {
    fontSize: 24,
    color: colors.gray[500],
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
});