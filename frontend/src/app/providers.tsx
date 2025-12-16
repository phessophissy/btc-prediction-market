"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, ReactNode } from "react";
import { StacksAuthProvider } from "@/contexts/StacksAuthContext";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <StacksAuthProvider>{children}</StacksAuthProvider>
    </QueryClientProvider>
  );
}
