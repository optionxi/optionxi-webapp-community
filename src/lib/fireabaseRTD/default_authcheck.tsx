'use client';

import { app } from "@/utils/firebaseConfig";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";
import { signOut as nextAuthSignOut } from "next-auth/react";

export const checkUserAuthentication = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (user) {
    return user.uid;
  } else {
    console.log("User is not authenticated, signing out...");
    
    // Sign out from Firebase Authentication
    await firebaseSignOut(auth);

    // Sign out from NextAuth
    await nextAuthSignOut({ redirect: true });

    // Clear local storage and session storage
    localStorage.clear();
    sessionStorage.clear();

    console.log("Successfully signed out from Firebase and NextAuth");
  }
};
