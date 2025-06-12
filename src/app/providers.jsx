"use client";

import * as React from "react";

import { HeroUIProvider } from "@heroui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "@/libs/environtment";
import { ToastProvider } from "@heroui/toast";

export default function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HeroUIProvider>
        <ToastProvider />
        {children}
      </HeroUIProvider>
    </GoogleOAuthProvider>
  );
}
