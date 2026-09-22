'use client';

import { app } from "@/utils/firebaseConfig";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";
import { signOut as nextAuthSignOut } from "next-auth/react";

export const checkUserAuthentication = async (): Promise<string | null> => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (user) {
    return user.uid;
  } else {
    console.log("User is not authenticated, signing out...");
    
    // Sign out from Firebase Authentication
    await firebaseSignOut(auth);

    // Sign out from NextAuth
    await nextAuthSignOut({ redirect: false });

    // Clear any stored data (but not localStorage/sessionStorage in artifacts)
    if (typeof window !== 'undefined') {
      // Clear any application-specific storage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (error) {
        console.warn('Could not clear storage:', error);
      }
    }

    console.log("Successfully signed out from Firebase and NextAuth");
    return null;
  }
};

// Additional auth utilities
export const getCurrentUser = () => {
  const auth = getAuth(app);
  return auth.currentUser;
};

export const getCurrentUserId = (): string | null => {
  const user = getCurrentUser();
  return user?.uid || null;
};

export const isUserAuthenticated = (): boolean => {
  const user = getCurrentUser();
  return !!user;
};

// Wait for auth state to be determined
export const waitForAuthState = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user?.uid || null);
    });
  });
};

// Check if user is authenticated and wait for auth state if needed
export const ensureAuthenticated = async (): Promise<string | null> => {
  const auth = getAuth(app);
  
  // If we already have a user, return immediately
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }
  
  // Wait for auth state to be determined
  return waitForAuthState();
};
