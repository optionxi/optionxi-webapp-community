"use client";

import { useEffect, useState } from "react";
import { signOut as firebaseSignOut } from "firebase/auth";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LayoutGrid, LogOut, User, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/utils/firebaseConfig";

export function UserNav() {
  const { data: session } = useSession();
  const [, setIsLoading] = useState(true);

  const logoutFunction = async () => {
    try {
      console.log("Signing out...");
       // Sign out from Firebase Authentication
          await firebaseSignOut(auth);
      
          // Sign out from NextAuth
          await nextAuthSignOut({ redirect: true });
      localStorage.clear();
      sessionStorage.clear();
      console.log("Signing out with Google complete");
    } catch (error) {
      console.error("Error signing out with Google:", error);
    }
  };

  // const loginFunction = () => {
  //   // signIn();
  // };

  useEffect(() => {
    if (session?.user?.image) {
      const image = new window.Image();
      image.src = session.user.image;
      image.onload = () => setIsLoading(false);
      image.onerror = () => setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [session?.user?.image]);

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              {session ? (
                <Button 
                  variant="outline" 
                  className="relative h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground p-0 overflow-hidden"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image ?? "/assets/images/logo_xi.png"}
                      alt="User Avatar"
                    />
                    <AvatarFallback className="bg-transparent">
                      {session.user?.name?.[0] ?? "Akku"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="icon"
                  className="relative h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="h-4 w-4" />
                </Button>
              )}
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {session ? "Profile" : "Login"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        {session ? (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user?.name ?? "Akkumon"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user?.email ?? "akku@optionxi.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link href="/dashboard" className="flex items-center">
                  <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:cursor-pointer" asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="w-4 h-4 mr-3 text-muted-foreground" />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="hover:cursor-pointer hover:bg-destructive hover:text-destructive-foreground" 
              onClick={logoutFunction}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem 
          className="hover:cursor-pointer" asChild
            // className="hover:cursor-pointer hover:bg-primary hover:text-primary-foreground" 
            // onClick={loginFunction}
          >
             <Link href="/login" className="flex items-center" >
             <LogIn className="w-4 h-4 mr-3" />
              Sign in
             </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}