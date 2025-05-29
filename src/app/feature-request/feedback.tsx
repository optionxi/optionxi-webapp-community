'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

// Extend the built-in Session type to include user.id
import { Session } from 'next-auth';
interface CustomSession extends Session {
  user: {
    id?: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

// Declare Canny types
declare global {
  interface Window {
    Canny: CannySDK;
  }
}

interface CannySDK {
  (action: 'identify', options: { appID: string; user: CannyIdentifyUser }): void;
  (action: 'render', options: CannyRenderOptions): void;
}

interface CannyIdentifyUser {
  email: string;
  name: string;
  id: string;
  avatarURL?: string | null;
  created?: string;
}

interface CannyRenderOptions {
  boardToken: string;
  basePath: string | null;
  ssoToken?: string | null;
  theme?: 'light' | 'dark' | 'auto';
}

const BOARD_TOKEN = process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN as string;

const FeatureRequestsPage = () => {
  const { data: session, status } = useSession();
  const [isCannyLoaded, setIsCannyLoaded] = useState(false);
  const { theme } = useTheme();

  const initCanny = useCallback(() => {
    if (typeof window !== 'undefined' && window.Canny && session?.user) {
      // Initialize Canny with user data from NextAuth session
      window.Canny('identify', {
        appID: BOARD_TOKEN,
        user: {
          email: session.user.email!,
          name: session.user.name || 'Anonymous User',
          id: (session as CustomSession).user.id || session.user.email!,
          avatarURL: session.user.image || null,
          created: new Date().toISOString(),
        },
      });

      window.Canny('render', {
        boardToken: BOARD_TOKEN,
        basePath: null,
        theme: theme as 'light' | 'dark' | 'auto'
      });
      
      setIsCannyLoaded(true);
    }
  }, [session, theme]);

  // Re-initialize Canny when session changes or theme changes
  useEffect(() => {
    if (session?.user && isCannyLoaded) {
      initCanny();
    }
  }, [session, isCannyLoaded, initCanny]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Card className="max-w-md w-full p-6">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">Please Sign In</h1>
            <p className="text-center text-muted-foreground mt-2">
              You need to be signed in to view and submit feature requests.
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              onClick={() => signIn()}
              className="w-full max-w-xs"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4">
        <Card>
          {session?.user && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-4">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full ring-1 ring-border"
                  />
                )}
                <div>
                  <p className="font-medium">
                    {session.user.name || session.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold">Feature Requests</h1>
            <p className="mt-2 text-muted-foreground">
              Share your ideas and vote on features you would like to see implemented.
            </p>
          </div>
          
          <div className="p-2">
            <Script
              src="https://cdn.canny.io/sdk.js"
              strategy="lazyOnload"
              onLoad={() => initCanny()}
            />
            <div data-canny className="bg-background" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FeatureRequestsPage;