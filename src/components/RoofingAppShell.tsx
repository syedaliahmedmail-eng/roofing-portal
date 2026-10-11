'use client';

import React from 'react';
import { useRole } from '@/context/RoleContext';
import { AdminLayout } from '@/components/views/AdminLayout';
import { CrewLayout } from '@/components/views/CrewLayout';
import { ClientLayout } from '@/components/views/ClientLayout';
import { RoleSwitcher } from '@/components/navigation/RoleSwitcher';

export function RoofingAppShell() {
  const { role } = useRole();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 relative">
      {/* Dynamic View rendering based on active role */}
      {role === 'admin' && <AdminLayout />}
      {role === 'crew' && <CrewLayout />}
      {role === 'client' && <ClientLayout />}

      {/* Persistent floating Role Switcher for Phase 1 dev testing */}
      <RoleSwitcher />
    </div>
  );
}
