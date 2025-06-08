"use client";

import Sidebar from "@/components/Sidebar";
import { withAuth } from "@/libs/withAuth";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-row bg-slate-100">
      <Sidebar />
      {children}
    </div>
  );
}

export default withAuth(DashboardLayout);
