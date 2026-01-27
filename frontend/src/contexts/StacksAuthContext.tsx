"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { AppConfig, UserSession, showConnect, UserData } from "@stacks/connect";
import { NETWORK } from "@/lib/constants";

interface StacksAuthContextType {
  isConnected: boolean;
  userData: UserData | null;
  stxAddress: string | null;
  network: typeof NETWORK;
  connect: () => void;
  disconnect: () => void;
}

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

const StacksAuthContext = createContext<StacksAuthContextType | undefined>(undefined);

export function StacksAuthProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
        setIsConnected(true);
      });
    } else if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setUserData(userData);
      setIsConnected(true);
    }
  }, []);

  const connect = useCallback(() => {
    showConnect({
      appDetails: {
        name: "BTC Prediction Market",
        icon: window.location.origin + "/bitcoin-logo.svg",
      },
      redirectTo: "/",
      onFinish: () => {
        const userData = userSession.loadUserData();
        setUserData(userData);
        setIsConnected(true);
      },
      userSession,
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut();
    setUserData(null);
    setIsConnected(false);
  }, []);

  const stxAddress = userData?.profile?.stxAddress?.mainnet ||
                     userData?.profile?.stxAddress?.testnet ||
                     null;

  return (
    <StacksAuthContext.Provider
      value={{
        isConnected,
        userData,
        stxAddress,
        network: NETWORK,
        connect,
        disconnect,
      }}
    >
      {children}
    </StacksAuthContext.Provider>
  );
}

export function useStacksAuth() {
  const context = useContext(StacksAuthContext);
  if (context === undefined) {
    throw new Error("useStacksAuth must be used within a StacksAuthProvider");
  }
  return context;
}
