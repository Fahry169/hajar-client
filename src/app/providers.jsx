'use client';

import * as React from 'react';

// 1. import `HeroUIProvider` component
import { HeroUIProvider } from '@heroui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from '@/libs/environtment';

function Providers({ children }) {
  // 2. Wrap HeroUIProvider at the root of your app
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </GoogleOAuthProvider>
  );
}

export default Providers;
