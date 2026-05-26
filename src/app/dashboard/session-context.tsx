"use client";

import { createContext, useContext } from "react";

type DashboardSessionUser = {
  name: string | null;
  email: string | null;
  image: string | null;
};

const DashboardSessionContext = createContext<DashboardSessionUser | null>(null);

type DashboardSessionProviderProps = {
  user: DashboardSessionUser;
  children: React.ReactNode;
};

export function DashboardSessionProvider({ user, children }: DashboardSessionProviderProps) {
  return (
    <DashboardSessionContext.Provider value={user}>{children}</DashboardSessionContext.Provider>
  );
}

export function useDashboardSession() {
  return useContext(DashboardSessionContext);
}