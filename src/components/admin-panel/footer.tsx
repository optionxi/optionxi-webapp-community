import React from 'react';
import Link from "next/link";
import { Github, Facebook, Instagram, Youtube, ExternalLink } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      icon: <Facebook size={18} />,
      href: "https://www.facebook.com/profile.php?id=61567519156193",
      label: "Facebook"
    },
    {
      icon: <Instagram size={18} />,
      href: "https://www.instagram.com/optionxi/",
      label: "Instagram"
    },
    {
      icon: <Youtube size={18} />,
      href: "https://www.youtube.com/channel/UCpzBvlP9V0hWhqc1_-1Zonw",
      label: "YouTube"
    },
    {
      icon: <Github size={18} />,
      href: "https://github.com/optionxi",
      label: "GitHub"
    }
  ];

  return (
    <footer className="z-20 w-full bg-background/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-4">
          {/* Left section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-lg font-bold tracking-tight">Built by Traders</h3>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Empowering traders with modern tools
            </p>
          </div>

          {/* Middle section */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={link.label}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="https://ui.shadcn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                shadcn/ui
                <ExternalLink size={12} />
              </Link>
              <span>•</span>
              <Link
                href="https://github.com/salimi-my/shadcn-ui-sidebar"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                credits
                <ExternalLink size={12} />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
             OptionXi © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;