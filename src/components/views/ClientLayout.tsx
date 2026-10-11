'use client';

import React from 'react';
import { useRole } from '@/context/RoleContext';
import {
  COMPANY_INFO,
  MOCK_JOBS,
  MOCK_INSPECTION_PHOTOS,
} from '@/data/mockRoofingData';
import { ProjectStatusStepper } from '@/components/client/ProjectStatusStepper';
import { ClientPhotoGallery } from '@/components/client/ClientPhotoGallery';
import { EstimateInvoiceReview } from '@/components/client/EstimateInvoiceReview';
import { ProjectManagerContactCard } from '@/components/client/ProjectManagerContactCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Home,
  CheckCircle2,
  Clock,
  Shield,
  Phone,
  Camera,
  Receipt,
  Download,
  Calendar,
  Sparkles,
  MapPin,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export function ClientLayout() {
  const { activeTab, setActiveTab } = useRole();

  // Active Plano job for David & Amanda Miller
  const job = MOCK_JOBS[0];

  const navItems = [
    { label: 'Project Timeline', icon: Calendar, badge: 'Live' },
    { label: 'Photos', icon: Camera, badge: `${MOCK_INSPECTION_PHOTOS.length}` },
    { label: 'Billing & Approvals', icon: Receipt, badge: 'Sign' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pb-32">
      {/* Homeowner Clean Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {COMPANY_INFO.name}
                  </span>
                  <Badge variant="success" className="text-[10px]">
                    Homeowner Portal
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  {job.address.street}, {job.address.city}, TX • Job #{job.jobNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-800 dark:text-slate-200 transition"
              >
                <Phone className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Need Help? {COMPANY_INFO.phone}
              </a>
            </div>
          </div>

          {/* Clean Navigation Bar Under Header */}
          <div className="flex space-x-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveTab(item.label)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Homeowner Portal Content */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        {/* Homeowner Project Hero Summary Card */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-700/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">
                Welcome Home, {job.clientName}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold mt-1">
                Your Roof Replacement is 55% Complete!
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                Property: {job.address.street}, {job.address.city}, TX {job.address.zip} • 32 Squares ({job.shingleBrand})
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center shrink-0 border border-white/20">
              <div className="text-2xl font-black text-emerald-300">Oct 12</div>
              <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">
                Target Sign-Off
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 pt-5 border-t border-white/15">
            <div className="flex justify-between text-xs font-medium text-emerald-200 mb-2">
              <span>Overall Build Progress</span>
              <span className="font-bold text-white">{job.progressPercent}% Finished</span>
            </div>
            <div className="w-full bg-emerald-950/80 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${job.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Project Timeline */}
        {activeTab === 'Project Timeline' && (
          <div className="space-y-6">
            <ProjectStatusStepper
              currentStageNote="Crew is on-site finishing ridge caps & flashing today on the Plano residence"
              estimatedCompletionDate="Saturday, Oct 12, 2026"
            />

            <ProjectManagerContactCard />
          </div>
        )}

        {/* Tab 2: Photos */}
        {activeTab === 'Photos' && (
          <div className="space-y-6">
            <ClientPhotoGallery photos={MOCK_INSPECTION_PHOTOS} />

            <ProjectManagerContactCard />
          </div>
        )}

        {/* Tab 3: Billing & Approvals */}
        {activeTab === 'Billing & Approvals' && (
          <div className="space-y-6">
            <EstimateInvoiceReview
              clientName={job.clientName}
              totalContractValue={job.totalContractValue}
            />

            <ProjectManagerContactCard />
          </div>
        )}
      </main>
    </div>
  );
}
