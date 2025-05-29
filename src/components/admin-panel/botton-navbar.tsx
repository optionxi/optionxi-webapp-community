"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getMenuListNavbar } from "@/lib/menu-list-nav";

export function BottomNavbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname(); // Track the current route
  const menuList = getMenuListNavbar();

  const toggleSubmenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  // Updated function to check if current path is this item or any of its submenus
  const isSelected = (menu: { href: string; submenus?: Array<{ href: string }> }) => {
    // Direct match for the main menu item
    if (pathname === menu.href) return true;
    
    // Check if current path matches any submenu
    if (menu.submenus && menu.submenus.length > 0) {
      return menu.submenus.some(submenu => pathname === submenu.href);
    }
    
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg lg:hidden z-50">
      <div className="flex justify-around p-2">
        {menuList.map((menu) => (
          <div key={menu.label} className="relative">
            {/* Clickable Menu Item */}
            <Link
              href={menu.href}
              onClick={(e) => {
                if (menu.submenus && menu.submenus.length > 0) {
                  e.preventDefault(); // Prevent navigation if the item has submenus
                  toggleSubmenu(menu.label);
                } else {
                  setActiveMenu(null); // Close submenu when navigating
                }
              }}
              className={cn(
                "flex flex-col items-center p-2 text-sm font-medium hover:text-primary transition-colors relative group",
                isSelected(menu) ? "text-primary" : "text-gray-500 dark:text-gray-400"
              )}
            >
              {/* Icon and Label */}
              <menu.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{menu.label}</span>

              {/* Background Highlight for Selected Item */}
              {isSelected(menu) && (
                <div className="absolute inset-0 bg-primary/10 rounded-lg" />
              )}
            </Link>

            {/* Submenu */}
            {activeMenu === menu.label && menu.submenus && menu.submenus.length > 0 && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 min-w-[180px]">
                {menu.submenus.map((submenu) => (
                  <Link
                    key={submenu.href}
                    href={submenu.href}
                    onClick={() => setActiveMenu(null)} // Close submenu when navigating
                    className={cn(
                      "flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded",
                      pathname === submenu.href ? "bg-gray-100 dark:bg-gray-700" : ""
                    )}
                  >
                    {submenu.icon && <submenu.icon className="h-4 w-4 mr-2" />}
                    <span>{submenu.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}