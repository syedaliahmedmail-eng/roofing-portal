'use client';

import React from 'react';
import { useRole } from '@/context/RoleContext';
import { Role } from '@/types/roofing';
import { ShieldCheck, HardHat, Home, Sparkles } from 'lucide-react';

const ROLES: { id: Role; label: string; description: string; icon: React.ElementType; color: string }[] = [
  {
    id: 'admin',
    label: 'Operations Admin',
    description: 'Dispatch, Job Kanban, Invoicing & Settings',
    icon: ShieldCheck,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'crew',
    label: 'Field Crew Lead',
    description: 'Mobile App, GPS Check-in & Photo Inspections',
    icon: HardHat,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'client',
    label: 'Homeowner Portal',
    description: 'Dallas Homeowner Live Progress & Approvals',
    icon: Home,
    color: 'from-emerald-600 to-teal-600',
  },
];

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl p-2 sm:p-2.5 transition-all text-white">
        <div className="flex items-center justify-between mb-2 px-2">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Phase 1 Dev Role Switcher
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Active Persona: <span className="text-amber-400 font-bold uppercase">{role}</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isActive = role === r.id;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`flex flex-col sm:flex-row items-center sm:items-start text-left p-2 sm:px-3 sm:py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r ' + r.color + ' text-white shadow-lg ring-2 ring-white/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-1 sm:mb-0 sm:mr-2.5 ${isActive ? 'bg-black/20' : 'bg-slate-700/50'}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </div>
                <div className="min-w-0 text-center sm:text-left">
                  <div className="text-xs sm:text-sm font-semibold truncate leading-tight">{r.label}</div>
                  <div className={`text-[10px] hidden sm:block truncate ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {r.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
