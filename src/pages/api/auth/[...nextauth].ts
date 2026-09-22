import { cert, getApps, initializeApp } from 'firebase-admin/app';
import NextAuth, {Account, Session } from "next-auth";
import { JWT } from 'next-auth/jwt';
import GoogleProvider from "next-auth/providers/google"

// Initialize Firebase Admin if it hasn't been already
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}



// Extend the Session type to include firebaseToken
declare module "next-auth" {
  interface Session {
    firebaseToken?: string;
    // user: {
    //   name?: string | null;
    //   email?: string | null;
    //   image?: string | null;
    //   uid?: string; // Add Firebase user ID
    // };
  }
}

export const NxtauthOptions = {
  // Configure one or more authentication providers
  providers: [
     GoogleProvider({
          clientId: process.env.GOOGLE_WEBCLIENT_ID!,
          clientSecret: process.env.GOOGLE_WEBCLIENT_SECRET!,
      }),
    // ...add more providers here
  ],

  callbacks: {
    async session({ session,token, }: { session: Session, token: JWT}) {
      if (session.user) {
        // Generate a custom Firebase token
        console.log("Session callback with user session found");
        if(token.firebaseToken)
        {
          // console.log("Firebase token found")
          session.firebaseToken = token.firebaseToken as string;
        }
        else
        {
          console.error("Firebase token missing in nxt auth");
        }
      }
      return session;
    },

      async jwt({ token, account }:{token: JWT,account: Account | null}) {
        // Store the ID token in the JWT when signing in
        if (account && account.provider === "google" && account.id_token) {
          token.firebaseToken = account.id_token;
        }
        return token;
      },
      
    }
  }

export default NextAuth(NxtauthOptions)

