"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <NextThemesProvider defaultTheme="light">{children}</NextThemesProvider>
    </SessionProvider>
  );
};

export default Providers;
