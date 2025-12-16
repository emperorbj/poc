// // app/index.tsx

// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useStore } from '../store/useStore';
// import { colors, commonStyles } from '../styles/commonStyles';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function WelcomeScreen() {
//   const router = useRouter();
//   const isAuthenticated = useStore((state) => state.isAuthenticated);
//   const tenantDetails = useStore((state) => state.tenantDetails);
//   const isInitialized = useStore((state) => state.isInitialized);
//   const [hasNavigated, setHasNavigated] = useState(false);

//   useEffect(() => {
//     console.log('🏠 Welcome screen state:', {
//       isInitialized,
//       isAuthenticated,
//       hasTenantDetails: !!tenantDetails,
//       hasNavigated,
//     });

//     // Only navigate after initialization is complete and haven't navigated yet
//     if (isInitialized && !hasNavigated) {
//       if (isAuthenticated && tenantDetails) {
//         console.log('✈️ Navigating to tabs (user authenticated with tenant details)');
//         setHasNavigated(true);
//         // Use setTimeout to ensure navigation happens after render
//         setTimeout(() => {
//           router.replace('/(tabs)');
//         }, 100);
//       } else if (isAuthenticated && !tenantDetails) {
//         console.log('✈️ Navigating to tenant setup (user authenticated without tenant details)');
//         setHasNavigated(true);
//         setTimeout(() => {
//           router.replace('/auth/tenant-setup');
//         }, 100);
//       } else if (!isAuthenticated && hasNavigated) {
//         // Reset navigation flag when user logs out
//         console.log('🔄 User logged out, resetting navigation');
//         setHasNavigated(false);
//       }
//     }
//   }, [isAuthenticated, tenantDetails, isInitialized, hasNavigated]);

//   // Don't render welcome screen if user is authenticated and navigation is pending
//   if (isAuthenticated && !hasNavigated) {
//     return null;
//   }

//   return (
//     <SafeAreaView style={commonStyles.container}>
//       <View style={styles.welcomeContainer}>
//         <View style={styles.logoPlaceholder}>
//           <Image style={styles.logo} source={require('../assets/images/new-logo.png')} />
//         </View>
//         <Text style={styles.appName}>Humaein</Text>
//         <Text style={styles.tagline}>Patients before Paperwork</Text>

//         <View style={styles.cta}>
//           <TouchableOpacity
//             style={commonStyles.button}
//             onPress={() => router.push('/auth/login')}
//           >
//             <Text style={commonStyles.buttonText}>Login</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[commonStyles.button, styles.signupButton]}
//             onPress={() => router.push('/auth/signup')}
//           >
//             <Text style={[commonStyles.buttonText, styles.signupButtonText]}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   welcomeContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   cta: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 20,
//     justifyContent: 'space-between',
//   },
//   logoPlaceholder: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: 'transparent',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//     overflow: 'hidden',
//   },
//   logo: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   appName: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: colors.gray[800],
//     marginBottom: 8,
//   },
//   signupButton: {
//     backgroundColor: colors.white,
//     borderWidth: 2,
//     borderColor: colors.primary,
//   },
//   signupButtonText: {
//     color: colors.primary,
//   },
//   tagline: {
//     fontSize: 16,
//     color: colors.gray[500],
//     marginBottom: 40,
//   },
// });

// app/index.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.welcomeContainer}>
        <View style={styles.logoPlaceholder}>
          <Image style={styles.logo} source={require('../assets/images/new-logo.png')} />
        </View>
        <Text style={styles.appName}>Humaein</Text>
        <Text style={styles.tagline}>Patients before Paperwork</Text>

        <View style={styles.cta}>
          <TouchableOpacity
            style={commonStyles.button}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={commonStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.button, styles.signupButton]}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={[commonStyles.buttonText, styles.signupButtonText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'space-between',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: 8,
  },
  signupButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  signupButtonText: {
    color: colors.primary,
  },
  tagline: {
    fontSize: 16,
    color: colors.gray[500],
    marginBottom: 40,
  },
});