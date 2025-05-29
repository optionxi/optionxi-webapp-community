'use client';

import { Session} from "next-auth"
import { SessionProvider } from "next-auth/react";
import { FirebaseAuthProvider } from "./firebaseAuthContext";

type Props={
  children:React.ReactNode;
  session:Session | null;
}

export default function SessionProviderFn({children,session}:Props){
  return( 
      <SessionProvider session={session}>
        <FirebaseAuthProvider>
          {children}
        </FirebaseAuthProvider>
      </SessionProvider>
    )
}