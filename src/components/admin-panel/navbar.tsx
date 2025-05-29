'use client';

import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/admin-panel/user-nav";
import { SearchBarCustom } from "@/app/(authenticated)/dashboard/search-bar";
import { SheetMenu } from "./sheet-menu";
import { usePathname } from 'next/navigation'; // Import usePathname

interface NavbarProps {
  title: string;
}

export function Navbar({ }: NavbarProps) {
  const pathname = usePathname(); // Get the current route

  // Check if the current route is not '/dashboard'
  const isSearchBarVisible = pathname !== '/dashboard';

  return (
    <header className="sticky top-0 z-20 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="lg:flex items-center space-x-4 lg:space-x-0 flex-1">
          <SheetMenu />
        </div>
        <div className="w-full p-2">
          {isSearchBarVisible && <SearchBarCustom />} {/* Conditionally render SearchBarCustom */}
        </div>
        <div className="flex items-center justify-end space-x-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}