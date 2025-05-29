import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, User } from 'firebase/auth';
import { useSession,  } from 'next-auth/react';
import { FirebaseApp } from 'firebase/app';
import { app, app2 } from './firebaseConfig';
import { Session } from 'next-auth';

interface FirebaseAuthContextType {
  firebaseUser: User | null;
  firebaseUser2: User | null;
  loading: boolean;
  loading2: boolean;
}

interface SessionWithFirebaseToken extends Session {
  firebaseToken?: string;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  firebaseUser: null,
  firebaseUser2: null,
  loading: true,
  loading2: true,
});

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [firebaseUser2, setFirebaseUser2] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const auth = getAuth(app);
    const auth2 = getAuth(app2);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setLoading(false);
      } else {
        setLoading(false);
        if (session?.firebaseToken) {
          console.log('Attempting to sign in to Firebase app1 as user signedout...');
          const success1 = await signInFirebaseWithNextAuthSession(
            session as SessionWithFirebaseToken,
            app
          );

          if (success1) {
            console.log('Firebase RE sign-in successful');
            return true;
          } else {
            console.error('Firebase RE sign-in failed');
            return false;
          }
        } else {
          console.error('No firebase token found for resignin app1');
        }
      }
    });

    const unsubscribe2 = onAuthStateChanged(auth2, async (user2) => {
      if (user2) {
        setFirebaseUser2(user2);
        setLoading2(false);
      } else {
        setLoading2(false);
        if (session?.firebaseToken) {
          console.log('Attempting to sign in to Firebase app2 as user signedout...');
          const success2 = await signInFirebaseWithNextAuthSession(
            session as SessionWithFirebaseToken,
            app2
          );

          if (success2) {
            console.log('Firebase RE sign-in successful');
            return true;
          } else {
            console.error('Firebase RE sign-in failed');
            return false;
          }
        } else {
          console.error('No firebase token found for resignin app2');
        }
      }
    });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, [session]); // Added session to dependency array

  useEffect(() => {
    const signInBothApps = async () => {
      if (loading || loading2 || !session?.firebaseToken) return;

      if (!firebaseUser || !firebaseUser2) {
        console.log('Attempting to sign in to both Firebase apps...');
        const success1 = await signInFirebaseWithNextAuthSession(
          session as SessionWithFirebaseToken,
          app
        );
        const success2 = await signInFirebaseWithNextAuthSession(
          session as SessionWithFirebaseToken,
          app2
        );

        if (success1 && success2) {
          console.log('Signed in to both Firebase apps successfully');
        } else {
          console.error('Failed to sign in to one or both Firebase apps');
        }
      }
    };

    signInBothApps();
  }, [session, firebaseUser, firebaseUser2, loading, loading2]);

  return (
    <FirebaseAuthContext.Provider value={{ firebaseUser, firebaseUser2, loading, loading2 }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

async function signInFirebaseWithNextAuthSession(
  session: SessionWithFirebaseToken,
  app: FirebaseApp
): Promise<boolean> {
  if (!session?.firebaseToken) {
    console.error('No Firebase token found in session');
    return false;
  }

  try {
    const auth = getAuth(app);
    console.log('Signing in to Firebase with the provided token...');
    const credential = GoogleAuthProvider.credential(session.firebaseToken);
    const result = await signInWithCredential(auth, credential);

    if (result.user) {
      console.log('Firebase sign-in successful');
      return true;
    } else {
      console.error('Firebase sign-in failed');
      return false;
    }
  } catch (error) {
    console.error('Error signing in to Firebase:', error);
    return false;
  }
}