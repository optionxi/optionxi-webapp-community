// app/admin/layout.tsx
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { PropsWithChildren } from "react";
import Script from "next/script";

export default function AdminLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      <AdminPanelLayout>{children}</AdminPanelLayout>
    </>
  );
}
