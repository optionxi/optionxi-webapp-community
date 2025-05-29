// app/admin/layout.tsx
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { type PropsWithChildren } from "react";

export default function AdminLayout({ children }: PropsWithChildren) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
