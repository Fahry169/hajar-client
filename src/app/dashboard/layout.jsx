"use client";

import NavDashboard from "@/components/NavDashboard";
import Sidebar from "@/components/Sidebar";
import { withAuth } from "@/libs/withAuth";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-row bg-gradient-to-b from-blue-100 to-slate-50">
      <Sidebar />
       <div className="flex-grow max-h-screen overflow-auto py-4 px-2 sm:px-2 space-y-4">
          <NavDashboard />
          {children}
        </div>
    </div>
  );
}

export default withAuth(DashboardLayout);
