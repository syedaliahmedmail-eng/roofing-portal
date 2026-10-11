'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '@/types/roofing';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const DEFAULT_TABS: Record<Role, string> = {
  admin: 'Dashboard',
  crew: 'My Jobs',
  client: 'Project Timeline',
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>('admin');
  const [activeTab, setActiveTab] = useState<string>(DEFAULT_TABS['admin']);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('apex_roofing_active_role') as Role | null;
      if (savedRole && (savedRole === 'admin' || savedRole === 'crew' || savedRole === 'client')) {
        setRoleState(savedRole);
        setActiveTab(DEFAULT_TABS[savedRole]);
      }
    } catch {
      // ignore in SSR / storage restrictions
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    setActiveTab(DEFAULT_TABS[newRole]);
    try {
      localStorage.setItem('apex_roofing_active_role', newRole);
    } catch {
      // ignore
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, activeTab, setActiveTab }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
