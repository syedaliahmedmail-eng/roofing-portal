'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileCheck,
  ShieldCheck,
  Truck,
  Hammer,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';

export interface StepperStage {
  id: string;
  name: string;
  date: string;
  status: 'completed' | 'active' | 'upcoming';
  description: string;
  icon: React.ElementType;
}

interface ProjectStatusStepperProps {
  currentStageNote?: string;
  estimatedCompletionDate?: string;
}

export function ProjectStatusStepper({
  currentStageNote = 'Crew Lead Mateo Rodriguez is on-site finishing ridge caps & flashing today',
  estimatedCompletionDate = 'Saturday, Oct 12, 2026',
}: ProjectStatusStepperProps) {
  const stages: StepperStage[] = [
    {
      id: 'contract',
      name: 'Contract Signed',
      date: 'Oct 02, 2026',
      status: 'completed',
      description: 'Scope approved with GAF Timberline HDZ Class 4 system.',
      icon: FileCheck,
    },
    {
      id: 'insurance',
      name: 'Insurance Approved',
      date: 'Oct 05, 2026',
      status: 'completed',
      description: 'State Farm Texas Claim #STF-992140 approved full tear-off.',
      icon: ShieldCheck,
    },
    {
      id: 'materials',
      name: 'Materials Delivered',
      date: 'Oct 08, 2026',
      status: 'completed',
      description: '96 Bundles, synthetic felt, ice & water delivered to driveway.',
      icon: Truck,
    },
    {
      id: 'installation',
      name: 'Installation in Progress',
      date: 'Oct 10, 2026 (Today)',
      status: 'active',
      description: currentStageNote,
      icon: Hammer,
    },
    {
      id: 'inspection',
      name: 'Final Cleanup & Inspection',
      date: 'Est. Oct 12, 2026',
      status: 'upcoming',
      description: 'Magnetic nail sweep, city permit sign-off & warranty transfer.',
      icon: CheckCircle2,
    },
  ];

  return (
    <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
      <CardContent className="p-5 sm:p-6 space-y-6">
        {/* Header Strip with Live Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Live Roof Replacement Progress
              </h3>
              <Badge variant="success" className="text-[10px]">
                Stage 4 of 5 Active
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Plano, TX • GAF Master Elite Certified Installation
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 px-3.5 py-2 rounded-xl text-xs sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
              Estimated Completion
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">
              {estimatedCompletionDate}
            </span>
          </div>
        </div>

        {/* Desktop Horizontal Stepper Line */}
        <div className="hidden md:block relative pt-4 pb-2">
          {/* Connector Line behind steps */}
          <div className="absolute top-9 left-10 right-10 h-1 bg-slate-200 dark:bg-slate-800 z-0">
            <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: '75%' }} />
          </div>

          <div className="grid grid-cols-5 gap-2 relative z-10">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = stage.status === 'completed';
              const isActive = stage.status === 'active';

              return (
                <div key={stage.id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : isActive
                        ? 'bg-amber-500 text-white ring-4 ring-amber-400/30 animate-bounce'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <h4
                    className={`mt-3 text-xs font-bold leading-tight ${
                      isActive
                        ? 'text-amber-600 dark:text-amber-400'
                        : isCompleted
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-medium">{stage.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Stepper Line */}
        <div className="md:hidden space-y-4 relative pl-7 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isCompleted = stage.status === 'completed';
            const isActive = stage.status === 'active';

            return (
              <div key={stage.id} className="relative">
                <div
                  className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div
                  className={`p-3 rounded-xl border text-xs ${
                    isActive
                      ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80 shadow-xs'
                      : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold ${
                        isActive
                          ? 'text-amber-700 dark:text-amber-300'
                          : isCompleted
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500'
                      }`}
                    >
                      {stage.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{stage.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Stage Callout Box */}
        <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-start space-x-3">
          <div className="p-2 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide text-[10px]">
              Live Crew Activity Report
            </span>
            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              &quot;{currentStageNote}&quot;
            </p>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" /> Updated 24 minutes ago
              </span>
              <span>•</span>
              <span>All 32 Squares dried-in</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
