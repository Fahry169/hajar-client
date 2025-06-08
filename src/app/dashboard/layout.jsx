"use client";
import { withAuth } from "@/libs/withAuth";

function DashboardLayout({ children }) {
  return <div>{children}</div>;
}

export default withAuth(DashboardLayout);
