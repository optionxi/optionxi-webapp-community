'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { User, LogIn, UserX } from "lucide-react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import TraderProfile from "./profile-section";

const NoProfileFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
    <div className="p-6 bg-gray-50 rounded-full">
      <UserX className="w-12 h-12 text-gray-400" />
    </div>
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold tracking-tight">No Profile Found</h2>
      <p className="text-gray-500 max-w-md">
        Looks like you haven&apos;t signed in yet. Sign in to view and manage your profile.
      </p>
    </div>
    <div className="flex gap-4">
      <Button 
        variant="outline" 
        asChild
      >
        <Link href="/">Go Home</Link>
      </Button>
      <Button asChild>
        <Link href="/login">Sign In</Link>
      </Button>
    </div>
  </div>
);

export default function ProfilePage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showNoProfile, setShowNoProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setUserId(user.uid);
      } else {
        setShowAuthDialog(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ContentLayout title="All Posts">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <AlertDialog 
        open={showAuthDialog} 
        onOpenChange={(open) => {
          setShowAuthDialog(open);
          if (!open) setShowNoProfile(true);
        }}
      >
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <div className="mx-auto bg-primary/5 p-3 rounded-full w-fit">
              <User className="w-6 h-6 text-primary" />
            </div>
            <AlertDialogTitle className="text-center">
              Sign in Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Please sign in to view your profile and trading history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="sm:w-full">
              Cancel
            </AlertDialogCancel>
            <Button 
              className="sm:w-full gap-2" 
              onClick={() => router.push('/login')}
            >
              <LogIn className="w-4 h-4" />
              Continue to Login
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showNoProfile ? (
        <NoProfileFound />
      ) : (
        <TraderProfile userId={userId} />
      )}
    </ContentLayout>
  );
}