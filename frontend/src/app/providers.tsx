"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
import { StacksAuthProvider } from "@/contexts/StacksAuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <StacksAuthProvider>{children}</StacksAuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
