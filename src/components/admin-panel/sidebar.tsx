"use client";
import { Menu } from "@/components/admin-panel/menu";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import Image from "next/image"; // Import Next.js Image component

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;

  return (
    <aside
      className={cn(
"fixed top-0 left-0 z-50 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden"
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800"
      >
        <div
          className={cn(
            "flex items-center gap-2 mb-1 transition-transform ease-in-out duration-300",
            !getOpenState() ? "translate-x-1 justify-center" : "translate-x-0 justify-start"
          )}
        >
          {/* Display logo and text based on getOpenState */}
          <Image
            src="/assets/images/logo_xi.png" // Update this path to your logo image
            alt="Option Xi Logo"
            width={24} // Adjust width and height as needed
            height={24}
            className="mr-1"
          />
          {getOpenState() && (
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-opacity duration-300",
                !getOpenState() ? "opacity-0 hidden" : "opacity-100"
              )}
            >
              OptionXi
            </h1>
          )}
        </div>
        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
