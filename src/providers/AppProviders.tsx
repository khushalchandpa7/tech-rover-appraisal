"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Lightweight React Context for app-wide values that don't warrant a
 * heavier state library. Add user/session/theme here as the app grows.
 */
interface AppContextValue {
  appName: string;
}

const AppContext = createContext<AppContextValue>({
  appName: "TechRover Appraisals",
});

export function useApp(): AppContextValue {
  return useContext(AppContext);
}

interface AppProvidersProps {
  children: ReactNode;
  appName?: string;
}

export function AppProviders({
  children,
  appName = "TechRover Appraisals",
}: AppProvidersProps) {
  return (
    <AppContext.Provider value={{ appName }}>{children}</AppContext.Provider>
  );
}
